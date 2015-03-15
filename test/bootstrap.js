/**
 * Pre-load these modules for testing.
 */
$fs = require('fs');
$path = require('path');
assert = require('assert');
expect = require('expect.js');

/**
 * Code coverage
 */
require("blanket")({});

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