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
 * @param {function} callback
 */
promise = function (message, callback) {
    if (typeof message !== 'string') {
        throw Error('invalid message argument');
    }
    it('a promise that ' + message, function (done) {
        callback.should.be.a.Function();
        var p = callback.call(this, done);
        assert.isPromise(p, done);
    });
};

/**
 * @param {string=} message
 */
promise.skip = function (message) {
    it.skip(message, _.noop);
};

/**
 * @param {string} message
 * @param {function} callback
 */
throws = function (message, callback) {
    if (typeof message !== 'string') {
        throw Error('invalid message argument');
    }
    it('throws ' + message, function () {
        callback.should.be.a.Function();
        (function () {
            callback.call(this);
        }).should.throw(message);
    });
};

/**
 * @param {string=} message
 * @param {function=} callback
 */
throws.skip = function (message, callback) {
    it.skip('throws ' + message, _.noop);
};

/**
 * @param {string} message
 * @param {function} callback
 * @param {function(string,*,string,number)} verify
 */
writes = function (message, callback, verify) {
    it('writes ' + message, function () {
        callback.should.be.a.Function();
        verify.should.be.a.Function();

        var self = this;
        self.count = 0;
        var l = new Loader();
        l.replace('fs', {
            writeFileSync: function (name, value, type) {
                self.name = name;
                self.output = value;
                self.type = type;
                self.count++;
            }
        });

        callback.call(this, l);
        self.count.should.be.equal(1, 'fs.writeFileSync was not called');
        verify(self.name, self.output, self.type, self.count);
    });
};

/**
 * @param {string} message
 * @param {Function=} callback
 */
writes.skip = function (message, callback) {
    it.skip('writes ' + message, _.noop);
};

/**
 * @param {string} message
 * @param {function} callback
 * @param {function|string} input
 * @param {function(string,string,number)=} verify
 */
reads = function (message, callback, input, verify) {
    it('reads ' + message, function () {

        callback.should.be.a.Function();
        if (verify) {
            verify.should.be.a.Function();
        }

        var self = this;
        self.count = 0;
        var l = new Loader();
        l.replace('fs', {
            readFileSync: function (name, type) {
                self.name = name;
                self.type = type;
                self.count++;
                return _.isFunction(input) ? input() : input;
            }
        });

        callback.call(this, l);
        self.count.should.be.equal(1, 'fs.readFileSync was not called');
        verify && verify(self.name, self.type, self.count);
    });
};

/**
 * @param {string} message
 * @param {function} callback
 */
reads.skip = function (message, callback) {
    it.skip('reads ' + message, _.noop);
};

/**
 * Creates nested describe and loads the module being tested.
 *
 * @param {string[]|string} names
 * @param {function} callback
 */
load = function (names, callback) {
    names = _.isArray(names) ? names : [names];
    names.push(callback);
    describe(_.first(names), function () {
        __loader.resolve_module(names);
    });
};