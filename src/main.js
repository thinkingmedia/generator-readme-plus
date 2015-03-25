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

var plugins = manager.load('plugin', './plugins.json');
if(plugins === null)
{
	process.exit(-1);
}

var services = manager.load('service', './services.json');
if(services === null)
{
	manager.stop(plugins);
	process.exit(-1);
}

/**
 * Creates a function that calls a method on a module (only if it exists).
 *
 * @param {string} name
 * @returns {function(string):Q.promise}
 */
function callMethod(name)
{
	return function(module)
	{
		if(_.isFunction(module[name]))
		{
			logger.debug('Module[%s]: %s', module.name, name);
			module[name](section.root, services);
		}
		return Q.thenResolve();
	}
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
					_.isFunction(plugin.read) && plugin.read(conf.cwd + file, section.root, services);
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
					_.isFunction(plugin.done) && plugin.done(conf.cwd, files, section.root, services);
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
 * Renders the README.md file
 */
function render()
{
	logger.debug('Render');

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
}

var beforeRead = callMethod('beforeRead');
var beforeWrite = callMethod('beforeWrite');
var write = callMethod('write');

/**
 * Calls each function above in order, but waits for the return promise to resolve before it calls the next function.
 * After all the functions are called the returned promise is resolved.
 */
async.callThese(plugins, [beforeRead, read, beforeWrite, write])
	.then(function()
		  {
			  /**
			   * The plugins are done. Now the services can write.
			   */
			  async.callThese(services, [beforeWrite, write])
				  .then(function()
						{
							render();

							manager.stop(plugins);
							manager.stop(services);
						})
				  .catch(function(err)
						 {
							 logger.error(err);
						 });
		  })
	.catch(function(err)
		   {
			   logger.error(err);
		   });
