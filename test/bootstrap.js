/**
 * These variables are global for all unit tests.
 */
_ = require('lodash');
fs = require('fs');
path = require('path');
assert = require('assert');
should = require('should');

/**
 * Path to test data
 *
 * @type {string}
 * @global
 */
__data = __dirname + path.sep + "data" + path.sep;

/**
 * Loader that can be used by all tests.
 *
 * @type {Plus.Loader}
 * @global
 */
Loader = require('../src/Plus/Loader');