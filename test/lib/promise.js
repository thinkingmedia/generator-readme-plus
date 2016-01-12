var _ = require('lodash');
var assert = require('assert');

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
module.exports = function (message, callback) {
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
module.exports.skip = function (message) {
    it.skip(message, _.noop);
};
