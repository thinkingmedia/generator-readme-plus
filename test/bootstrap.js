/**
 * These variables are global for all unit tests.
 */
Q = require('Q');
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

// new test function just for promises
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

// simplifies testing for exceptions
throws = function (message, callback, error) {
    if (typeof message !== 'string') {
        throw Error('invalid message argument');
    }
    it(message, function () {
        assert.ok(typeof callback === 'function');
        (function () {
            callback.call(this);
        }).should.throw(error);
    });
};