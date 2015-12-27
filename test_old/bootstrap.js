/**
 * These variables are global for all unit tests.
 */
_ = require('lodash');
fs = require('fs');
path = require('path');
assert = require('assert');

//require('winston').cli();
//require('winston').level = 'DEBUG';

/**
 * Path to test data
 *
 * @type {string}
 */
__data = __dirname + path.sep + "data" + path.sep;

/**
 * Requires the module from the app and starts a test for it. Passing
 * the module to the callback. If the modules parameter is an array, then
 * all those modules are required and passed as arguments.
 *
 * @param {string|Array.<string>} modules
 * @param {function(*)} callback
 */
//test = function(modules, callback)
//{
//	if(!_.isArray(modules))
//	{
//		test([modules], callback);
//		return;
//	}
//
//	var prefix = 'Test: ';
//	var args = _.map(modules, function(module)
//	{
//		console.log(prefix + module);
//
//		if(_.startsWith(module, "/"))
//		{
//			throw Error("Do not start module path with / character: " + module);
//		}
//
//		var file = __dirname + path.sep + ".." + path.sep + "src" + path.sep + module + ".js";
//		if(!fs.existsSync(file))
//		{
//			throw Error("Required module not found: " + file);
//		}
//		prefix = 'Use: ';
//		return require(file);
//	});
//
//	describe(_.first(modules), function()
//	{
//		callback.apply(this, args);
//	});
//
//	console.log('');
//};
