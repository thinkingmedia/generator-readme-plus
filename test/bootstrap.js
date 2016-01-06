/**
 * These variables are global for all unit tests.
 */
Q = require('q');
_ = require('lodash');
fs = require('fs');
assert = require('assert');
should = require('should');

var path = require('path');

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

/**
 * Loader that can be used by all tests.
 * @type {Plus.Loader}
 * @global
 */
__loader = new Loader();

// maybe one day assert will add this method. So let's throw an error if it exists already.
if (typeof assert.isPromise === 'function') {
    throw Error('isPromise is already defined!');
}

// add a new method to the assert module, we can use this in our tests
assert.isPromise = function (p, done, message) {
    assert.ok(typeof done === 'function', 'isPromise requires you to pass done as second parameter');
    assert.ok((p instanceof Promise) || (typeof p === "object" && typeof p.done === "function"), message || 'is not a promise');
    p.done(function () {
        done();
    }, done);
};

/**
 * New test function just for promises
 *
 * @param {string} message
 * @param {Function} callback
 */
promise = function (message, callback) {
    if (typeof message !== 'string') {
        throw Error('invalid message argument');
    }
    it(message, function (done) {
        assert.ok(typeof callback === 'function');
        var p = callback.call(this, done);
        assert.isPromise(p, done);
    });
};

/**
 * @param {string=} message
 */
promise.skip = function(message) {
    it.skip(message, function(){

    });
};

/**
 * @param {string} message
 * @param {Function} callback
 */
throws = function (message, callback) {
    if (typeof message !== 'string') {
        throw Error('invalid message argument');
    }
    it('throws ' + message, function () {
        assert.ok(typeof callback === 'function');
        (function () {
            callback.call(this);
        }).should.throw(message);
    });
};

/**
 * @param {string=} message
 * @param {Function=} callback
 */
throws.skip = function (message, callback) {
    it.skip('throws ' + message, function () {

    });
};

/**
 * Creates nested describe and loads the module being tested.
 *
 * @param {string} namespace
 * @param {Function} callback
 */
load = function (namespace, callback) {
    if (typeof namespace !== 'string') {
        throw Error('invalid message argument');
    }

    describe(namespace, function () {
        var param = __loader.resolve(namespace);
        callback.call(this, param);
    });
};