var _ = require('lodash');

/**
 * @param {string} message
 * @param {function} callback
 */
module.exports = function (message, callback) {
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
module.exports.skip = function (message, callback) {
    it.skip('throws ' + message, _.noop);
};
