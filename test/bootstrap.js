/**
 * Pre-load these modules for testing.
 */
$fs = require('fs');
$path = require('path');
assert = require('assert');
expect = require('expect.js');

global.appRequire = function(name)
{
	return require(__dirname + $path.sep + ".." + $path.sep + "src" + $path.sep + name);
};

/**
 * Base directory of where to find the source code.
 *
 * @type {string}
 */
__src = __dirname + $path.sep + ".." + $path.sep + "src" + $path.sep;

/**
 * Path to test data
 *
 * @type {string}
 */
__data = __dirname + $path.sep + "data" + $path.sep;