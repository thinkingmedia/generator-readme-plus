/**
 * @readme
 *
 * Readme+ uses the contents of the current work folder to generate a `README.md` file for the project. Most of your
 * time is spent in the source code and this is where you can add notes to be included in the output `README.md`.
 *
 * Readme+ searches for `@readme` markers in the source code comments.
 */
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

if(params.version)
{
	params.showVersion();
	return;
}

if(params.help)
{
	params.usage();
	return;
}

try
{
	params.validate();
}
catch($ex)
{
	console.error("fatal: " + $ex.message);
	return;
}

if(!params.silent)
{
	params.copyright();
	params.showConfig();
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

	var ex = plugin.exclude + " node_modules/** webroot/** vendor/**";

	fileset(plugin.include, ex, conf, function(err, files)
	{
		logger.info('Read[%s]: Find %s --> %s', plugin.name, plugin.include, conf.cwd);

		if(err)
		{
			logger.error(err);
			defer.reject(err);
			return;
		}

		if(files.length === 0)
		{
			logger.info('  No files found.');
		}

		_.each(files, function(file)
		{
			try
			{
				var path = conf.cwd + "/" + file;
				logger.debug('Match: %s', path);
				_.isFunction(plugin.read) && plugin.read(path, section.root, services);
			}
			catch(ex)
			{
				logger.error(ex.message);
				logger.debug(ex.stack);
			}
		});

		logger.info('');

		defer.resolve();
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
		var outfile = params.work + params._file;
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
logger.info('');
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
