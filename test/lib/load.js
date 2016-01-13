var _ = require('lodash');

/**
 * @type {Plus.Loader}
 */
var Loader = require('../../src/Plus/Loader');

/**
 * Creates nested describe and loads the module being tested.
 *
 * @param {string[]|string} names
 * @param {function} callback
 */
module.exports = function (names, callback) {
    names = _.isArray(names) ? names : [names];
    names.push(callback);
    describe(_.first(names), function () {

        beforeEach(function () {
            this.loader = new Loader();
        });

        (new Loader()).resolve_module(names);
    });
};

/**
 * Creates nested describe.skip
 *
 * @param {string[]|string} names
 * @param {function=} callback
 */
module.exports.skip = function (names, callback) {
    names = _.isArray(names) ? names : [names];
    describe.skip(_.first(names), _.noop);
};