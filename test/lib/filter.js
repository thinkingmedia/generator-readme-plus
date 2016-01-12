var _ = require('lodash');

/**
 * @param {string} filter
 * @param {function} callback
 */
module.exports = function (filter, callback) {
    this._namespace = 'Plus/Filters/' + filter.replace(/:/g, '_');
    this._filter = filter;
    describe(this._namespace, function () {
        callback.call(this);
    });
};

/**
 * @param {string} filter
 * @param {function=} callback
 */
module.exports.skip = function (filter, callback) {
    var namespace = 'Plus/Filters/' + filter.replace(/:/g, '_');
    describe.skip(namespace, _.noop);
};
