var _ = require('lodash');
var Q = require('q');
var logger = require('winston');
var sprintf = require('sprintf-js').sprintf;

/**
 * Loads all the plugins for the app.
 *
 * @param {string} type
 * @param {string} json_file
 *
 * @returns {Array|null}
 */
exports.load = function(type, json_file)
{
	logger.debug('Load: ' + json_file);

	var options = require(json_file);

	options = _.filter(options, function(option)
	{
		return option.disable !== true;
	});

	if(options.length === 0)
	{
		logger.error('No %s options available.', type);
		return null;
	}

	var modules = _.map(options, function(option)
	{
		if(!_.isString(option.path))
		{
			logger.error('%s path not defined.', type);
			return false;
		}

		try
		{
			logger.debug('  Start: ' + option.path);

			var module = require(option.path);
			if(!_.isFunction(module.create))
			{
				logger.error('%s[%s]: Does not have factory create method.', type, option.path);
				return false;
			}

			var obj = module.create(option);
			if(_.isUndefined(obj) || !_.isObject(obj))
			{
				logger.error('%s[%s]: Failed to create %s object.', type, option.path, type);
				return false;
			}

			if(!obj.name || !_.isString(obj.name))
			{
				logger.error('%s[%s]: Must define a name property.', type, option.path);
				return false;
			}

			logger.debug('    %s[%s]: %s', obj.name, type, option.path);

			obj.info = function()
			{
				logger.info('%s[%s]: %s', type, obj.name, sprintf.apply(this, arguments));
			};
			obj.debug = function()
			{
				logger.debug('%s[%s]: %s', type, obj.name, sprintf.apply(this, arguments));
			};
			obj.error = function()
			{
				logger.error('%s[%s]: %s', type, obj.name, sprintf.apply(this, arguments));
			};

			if(_.isFunction(obj.start) && obj.start() !== true)
			{
				logger.debug('    %s[%s]: Failed to start', type, option.path);
				return false;
			}

			if(type === 'plugin')
			{
				if(!_.isString(obj.include))
				{
					logger.error('%s[%s]: Does not define an include.', type, obj.include);
					return false
				}

				obj.exclude = _.isString(obj.exclude) ? obj.exclude : '';
				obj.useSource = _.isBoolean(obj.useSource) ? obj.useSource : false;

				obj.include && logger.debug('    Include[%s]: %s', option.path, obj.include);
				obj.exclude && logger.debug('    Exclude[%s]: %s', option.path, obj.exclude);
			}

			return obj;
		}
		catch(ex)
		{
			logger.error(ex.message);
			logger.debug(ex.stack);
		}

		return false;
	});

	if(_.compact(modules).length !== modules.length)
	{
		logger.error('One or more %s failed to load.', type);
		exports.stop(modules);
		return null;
	}

	var valid = _.all(modules, function(plugin)
	{
		if(!_.isBoolean(plugin.valid))
		{
			logger.error('%s[%s]: Does not export valid property.', type, plugin.name);
			return false;
		}
		if(plugin.valid !== true && _.isFunction(plugin.usage))
		{
			plugin.usage();
		}
		return plugin.valid;
	});

	if(!valid)
	{
		return null;
	}

	logger.debug('');

	var names = _.map(modules, function(module)
	{
		return module.name;
	});
	return _.zipObject(names, modules);
};

/**
 * Tells each plugin that the app is about to exit.
 *
 * @param {Array} modules
 */
exports.stop = function(modules)
{
	_.each(modules || [], function(module)
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
};