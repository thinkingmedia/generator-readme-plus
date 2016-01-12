/**
 * These variables are global for all unit tests.
 */
Q = require('q');
_ = require('lodash');
fs = require('fs');
assert = require('assert');
should = require('should');

/**
 * Loader that can be used by all tests.
 *
 * @type {Plus.Loader}
 * @global
 */
Loader = require('../src/Plus/Loader');

/**
 * New test function just for promises
 *
 * @param {string} message
 * @param {function} callback
 */
promise = require('./lib/promise');

/**
 * @param {string} message
 * @param {function} callback
 */
throws = require('./lib/throws');

/**
 * @param {string} message
 * @param {function} callback
 * @param {function(string,*,string,number)} verify
 */
writes = require('./lib/writes');

/**
 * @param {string} message
 * @param {function} callback
 * @param {function|string} input
 * @param {function(string,string,number)=} verify
 */
reads = require('./lib/reads');

/**
 * @param {string[]|string} names
 * @param {function} callback
 */
load = require('./lib/load');

/**
 * @param {string} filter
 * @param {function} callback
 */
filter = require('./lib/filter');

/**
 * @param {*} input
 * @param {string} message
 * @param callback
 */
apply = require('./lib/apply');