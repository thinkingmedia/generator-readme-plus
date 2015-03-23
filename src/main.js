require('./bootstrap.js');

var _ = require('lodash');
var fileset = require('fileset');
var logger = require('winston');
var params = require('./params.js');
var manager = require("./manager.js");
var q = require('q');
var async = require('./async.js');

if(params.invalid())
{
	params.usage();
	return;
}

if(params.version)
{
	params.showVersion();
	return;
}

if(!params.silent)
{
	params.copyright();
}

if(!manager.load())
{
	process.exit(-1);
}

/**
 *
 * @param {Object} plugin
 * @param {Q.defer} defer
 */
function beforeRead(plugin, defer)
{
	if(_.isFunction(plugin.beforeRead))
	{
		logger.debug('Plugin[%s]: beforeRead', plugin.name);
		plugin.beforeRead();
	}
	defer.resolve(read);
}

/**
 *
 * @param {Object} plugin
 * @param {Q.defer} defer
 */
function read(plugin, defer)
{
	var conf = {
		cwd: plugin.useSource === true ? params.source : params.work
	};

	logger.debug('Plugin[%s]: Searching %s', plugin.name, conf.cwd);

	fileset(plugin.include, plugin.exclude, conf)
		.on('error', function(err)
			{
				logger.error(err);
				defer.resolve(beforeWrite);
			})
		.on('match', function(file)
			{
				try
				{
					logger.debug('Found: %s', conf.cwd + file);
					_.isFunction(plugin.read) && plugin.read(conf.cwd + file);
				}
				catch(ex)
				{
					logger.error(ex.message);
					logger.debug(ex.stack);
				}
			})
		.on('end', function(files)
			{
				try
				{
					logger.debug('End');
					_.isFunction(plugin.done) && plugin.done(conf.cwd, files);
					defer.resolve(beforeWrite);
				}
				catch(ex)
				{
					logger.error(ex.message);
					logger.debug(ex.stack);
					defer.resolve(beforeWrite);
				}
			});
}

/**
 *
 * @param {Object} plugin
 * @param {Q.defer} defer
 */
function beforeWrite(plugin, defer)
{
	if(_.isFunction(plugin.beforeWrite))
	{
		logger.debug('BeforeWrite: %s', plugin.name);
		plugin.beforeWrite();
	}
	defer.resolve(write);
}

/**
 *
 * @param {Object} plugin
 * @param {Q.defer} defer
 */
function write(plugin, defer)
{
	if(_.isFunction(plugin.write))
	{
		logger.debug('Write: %s', plugin.name);
		plugin.write();
	}
	defer.resolve();
}

async.callThese(manager.plugins, [beforeRead, read, beforeWrite, write]);
