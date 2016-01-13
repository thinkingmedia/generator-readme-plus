var Loader = require('../../src/Plus/Loader');
var _ = require('lodash');
var name = null;

/**
 * @param {string} filter
 * @param {function} callback
 */
module.exports = function (filter, callback) {
    name = filter;
    var namespace = 'Plus/Filters/' + filter.replace(/:/g, '_');
    describe(namespace, function () {

        beforeEach(function () {
            this.loader = new Loader();
            this.namespace = namespace;
            this.with = {};
        });

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

/**
 * @param {Object.<string,*>} values
 * @param {function} callback
 */
module.exports.with = function (values, callback) {
    describe(' with ' + _.keys(values).join(','), function () {

        beforeEach(function () {
            this.with = _.merge({}, this.with || {}, values);
        });

        callback.call(this);
    });
};

/**
 * @param {Object.<string,*>} values
 * @param {function=} callback
 */
module.exports.with.skip = function (values, callback) {
    describe.skip(' with ' + _.keys(values).join(','), _.noop);
};

/**
 * @param {*} input
 * @param {string} message
 * @param {function} callback
 */
module.exports.apply = function (input, message, callback) {

    it('Filters.apply("' + name + '",' + JSON.stringify(input) + ') ' + message, function (done) {
        /**
         * @type {Plus.Engine.Filters}
         */
        var Filters = this.loader.resolve('Plus/Engine/Filters');
        var filter = this.loader.resolve(this.namespace);

        var fs = new Filters();
        fs.add(name, filter);

        _.each(this.with, function (value, key) {
            fs.add(key, function () {
                return value;
            });
        });

        var p = fs.apply(name, input).then(callback);
        assert.isPromise(p, done);
    });
};

/**
 * @param {*} input
 * @param {string} message
 * @param callback
 */
module.exports.apply.skip = function (input, message, callback) {
    it.skip('Filters.apply("' + name + '",' + JSON.stringify(input) + ') ' + message, _.noop);
};