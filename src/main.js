require('./bootstrap.js');

var _ = require('lodash');
var fs = require('fs');
var fileset = require('fileset');
var logger = require('winston');
var params = require('./params.js');
var manager = require("./manager.js");
var Q = require('q');
var async = require('./async.js');
var section = require('./document/section.js');

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
 * Calls beforeRead on each plugin.
 *
 * @param {Object} plugin
 * @returns {Q.promise}
 */
function beforeRead(plugin)
{
	if(_.isFunction(plugin.beforeRead))
	{
		logger.debug('Plugin[%s]: beforeRead', plugin.name);
		plugin.beforeRead(section.root);
	}
	return Q.thenResolve();
}

/**
 * Calls read on each plugin.
 *
 * @param {Object} plugin
 * @returns {Q.promise}
 */
function read(plugin)
{
	var defer = Q.defer();

	var conf = {
		cwd: plugin.useSource === true ? params.source : params.work
	};

	logger.debug('Plugin[%s]: Searching %s', plugin.name, conf.cwd);

	fileset(plugin.include, plugin.exclude, conf)
		.on('error', function(err)
			{
				logger.error(err);
				defer.resolve();
			})
		.on('match', function(file)
			{
				try
				{
					logger.debug('Found: %s', conf.cwd + file);
					_.isFunction(plugin.read) && plugin.read(conf.cwd + file, section.root);
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
					_.isFunction(plugin.done) && plugin.done(conf.cwd, files, section.root);
					defer.resolve();
				}
				catch(ex)
				{
					logger.error(ex.message);
					logger.debug(ex.stack);
					defer.resolve();
				}
			});

	return defer.promise;
}

/**
 * Calls beforeWrite on each plugin.
 *
 * @param {Object} plugin
 * @returns {Q.promise}
 */
function beforeWrite(plugin)
{
	if(_.isFunction(plugin.beforeWrite))
	{
		logger.debug('BeforeWrite: %s', plugin.name);
		plugin.beforeWrite(section.root);
	}
	return Q.thenResolve();
}

/**
 * Calls write on each plugin.
 *
 * @param {Object} plugin
 * @returns {Q.promise}
 */
function write(plugin)
{
	if(_.isFunction(plugin.write))
	{
		logger.debug('Write: %s', plugin.name);
		plugin.write(section.root);
	}
	return Q.thenResolve();
}

/**
 * Calls each function above in order, but waits for the return promise to resolve before it calls the next function.
 * After all the functions are called the returned promise is resolved.
 */
async.callThese(manager.plugins, [beforeRead, read, beforeWrite, write])
	.then(function()
		  {
			  logger.debug('All done.');

			  var lines = section.root.render();

			  if(params.verbose)
			  {
				  logger.info('');
				  _.each(lines, function(line)
				  {
					  logger.info(line);
				  });
			  }
			  else
			  {
				  var outfile = params.work + 'README.md';
				  fs.writeFileSync(outfile, lines.join("\n"), 'utf8');
			  }
		  })
	.catch(function(err)
		   {
			   logger.error(err);
		   });
