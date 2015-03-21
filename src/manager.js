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

	exports.options = _.filter(exports.options, function(option)
	{
		return option.disable !== true;
	});

	if(exports.options.length === 0)
	{
		logger.error('No plugins available.');
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
			logger.debug('Load: '+option.path);

			var module = require(option.path);
			if(!_.isFunction(module.create))
			{
				logger.error('Module[%s]: Does not have factory create method.', option.path);
				return false;
			}

			var plugin = module.create(option);
			if(_.isUndefined(plugin) || !_.isObject(plugin))
			{
				logger.error('Module[%s]: Failed to create plugin object.', option.path);
				return false;
			}

			logger.debug('Plugin[%s]: %s', plugin.name, option.path);

			if(_.isFunction(plugin.start) && plugin.start() !== true)
			{
				logger.debug('Plugin[%s]: Failed to start', option.path);
				return false;
			}

			plugin.include = _.isString(plugin.include) ? plugin.include : '';
			plugin.exclude = _.isString(plugin.exclude) ? plugin.exclude : '';
			plugin.useSource = _.isBoolean(plugin.useSource) ? plugin.useSource : false;

			plugin.include && logger.debug('Include[%s]: %s', option.path, plugin.include);
			plugin.exclude && logger.debug('Exclude[%s]: %s', option.path, plugin.exclude);

			return plugin;
		}
		catch(ex)
		{
			logger.error(ex.message);
			logger.debug(ex.stack);
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
		if(!_.isBoolean(plugin.valid))
		{
			logger.error('Plugin[%s]: Does not export valid property.', plugin.name);
			return false;
		}
		if(plugin.valid !== true && _.isFunction(plugin.usage))
		{
			plugin.usage();
		}
		return plugin.valid;
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
				logger.debug(ex.stack);
			}
			finally
			{
				module.stopped = true;
			}
		}
	});

	exports.plugins = null;
};