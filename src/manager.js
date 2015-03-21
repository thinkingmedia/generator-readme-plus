var _ = require('lodash');
var logger = require('winston');

/**
 * The options for each plugin.
 *
 * @type {Array}
 */
exports.options = require('./plugins.json');

/**
 * The loaded plugins.
 *
 * @type {Array|null}
 */
exports.plugins = null;

/**
 * Loads all the plugins for the app.
 *
 * @returns {boolean}
 */
exports.load = function()
{
	if(exports.plugins !== null)
	{
		logger.error('Plugins already loaded');
		return false;
	}

	exports.plugins = _.map(exports.options, function(option)
	{
		if(!_.isString(option.path))
		{
			logger.error('Plugin path not defined.');
			return false;
		}

		try
		{
			var module = require(option.path);

			logger.debug('Plugin: %s', module.name);

			if(_.isFunction(module.start) && module.start(option) !== true)
			{
				logger.debug('Plugin failed to start');
				return false;
			}

			if(!_.isString(module.include))
			{
				logger.error('Plugin must define an include pattern for fileset.');
				return false;
			}

			module.exclude = _.isString(module.exclude) ? module.exclude : '';
			module.useSource = _.isBoolean(module.useSource) ? module.useSource : false;

			logger.debug('Include: %s', module.include);
			logger.debug('Exclude: %s', module.exclude);

			return module;
		}
		catch(ex)
		{
			logger.error(ex.message);
		}

		return false;
	});

	if(_.compact(exports.plugins).length !== exports.plugins.length)
	{
		exports.stop();
		return false;
	}

	return _.all(exports.plugins, function(plugin)
	{
		if(plugin.valid !== true && _.isFunction(plugin.usage))
		{
			plugin.usage();
		}
		return !!plugin.valid;
	});
};

/**
 * Tells each plugin that the app is about to exit.
 */
exports.stop = function()
{
	_.each(exports.plugins || [], function(module)
	{
		if(!!module || module.stopped === true)
		{
			return;
		}

		if(_.isFunction(module.stop))
		{
			try
			{
				logger.debug('Stop: %s', module.name);
				module.stop();
			}
			catch(ex)
			{
				logger.error(ex.message);
			}
			finally
			{
				module.stopped = true;
			}
		}
	});

	exports.plugins = null;
};