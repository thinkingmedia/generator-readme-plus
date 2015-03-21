require('./bootstrap.js');

var _ = require('lodash');
var fileset = require('fileset');
var logger = require('winston');
var params = require('./params.js');
var manager = require("./manager.js");
var context = require('./context.js');

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
	return;
}

var includes = _.filter(manager.plugins, 'include');
_.each(includes, function(plugin)
{
	_.isFunction(plugin.beforeRead) && plugin.beforeRead(context);

	fileset(plugin.include, plugin.exclude, {
		cwd: plugin.useSource === true ? params.source : params.work
	}).on('error', function(err)
	{
		logger.error(err);
	}).on('match', function(file)
	{
		logger.debug('Match: %s', file);
		_.isFunction(plugin.read) && plugin.read(context, file);
	}).on('end', function(files)
	{
		logger.debug('End');
		_.isFunction(plugin.done) && plugin.done(context, files);
	});
});

_.each(manager.plugins, function(plugin)
{
	_.isFunction(plugin.beforeWrite) && plugin.beforeWrite(context);
});

_.each(manager.plugins, function(plugin)
{
	_.isFunction(plugin.write) && plugin.write(context);
});

render.draw(context);
