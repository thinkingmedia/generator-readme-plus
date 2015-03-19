/**
 * Pre-load these modules for testing.
 */
$fs = require('fs');
$path = require('path');
_ = require('lodash');
assert = require('assert');
expect = require('expect.js');

/**
 * Path to test data
 *
 * @type {string}
 */
__data = __dirname + $path.sep + "data" + $path.sep;

/**
 * Requires the module from the app and starts a test for it. Passing
 * the module to the callback. If the modules parameter is an array, then
 * all those modules are required and passed as arguments.
 *
 * @param {string|Array.<string>} modules
 * @param {function(*)} callback
 */
test = function(modules, callback)
{
	if(!_.isArray(modules))
	{
		test([modules], callback);
		return;
	}

	var prefix = 'Test: ';
	var args = _.map(modules, function(module)
	{
		console.log(prefix + module);

		if(_.startsWith(module, "/"))
		{
			throw new Error("Do not start module path with / character: " + module);
		}

		var path = __dirname + $path.sep + ".." + $path.sep + "src" + $path.sep + module + ".js";
		if(!$fs.existsSync(path))
		{
			throw new Error("Required module not found: " + path);
		}
		prefix = 'Use: ';
		return require(path);
	});

	describe(_.first(modules), function()
	{
		callback.apply(this, args);
	});

	console.log('');
};
