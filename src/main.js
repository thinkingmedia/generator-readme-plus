require('./bootstrap.js');

var _ = require('lodash');
var fileset = require('fileset');
var logger = require('winston');
var params = require('./params.js');
var manager = require("./manager.js");

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

var reads_files = _.filter(manager.plugins, 'include');
_.each(reads_files, function(plugin)
{
	var conf = {
		cwd: plugin.useSource === true ? params.source : params.work
	};

	logger.debug('');
	logger.debug('Plugin[%s]: Searching %s', plugin.name, conf.cwd);

	_.isFunction(plugin.beforeRead) && plugin.beforeRead();

	fileset(plugin.include, plugin.exclude, conf).on('error', function(err)
	{
		logger.error(err);
	}).on('match', function(file)
	{
		logger.debug('Found: %s', conf.cwd + file);
		_.isFunction(plugin.read) && plugin.read(conf.cwd + file);
	}).on('end', function(files)
	{
		logger.debug('End');
		_.isFunction(plugin.done) && plugin.done(conf.cwd, files);
	});
});

_.each(manager.plugins, function(plugin)
{
	_.isFunction(plugin.beforeWrite) && plugin.beforeWrite();
});

_.each(manager.plugins, function(plugin)
{
	_.isFunction(plugin.write) && plugin.write();
});

//render.draw();
