/**
 * These variables are global for all unit tests.
 */
_ = require('lodash');
fs = require('fs');
path = require('path');
assert = require('assert');

/**
 * Path to test data
 *
 * @type {string}
 */
__data = __dirname + path.sep + "data" + path.sep;

requirejs = require('requirejs');
requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});
