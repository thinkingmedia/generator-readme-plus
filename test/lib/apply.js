var Loader = require('../../src/Plus/Loader');

/**
 * @param {*} input
 * @param {string} message
 * @param callback
 */
module.exports = function (input, message, callback) {
    var self = this;
    it('Filter.apply("' + this._filter + '",' + JSON.stringify(input) + ') ' + message, function (done) {
        /**
         * Create a new loader.
         *
         * @type {Plus.Loader}
         */
        var loader = new Loader();

        /**
         * Load the filters engine.
         *
         * @type {Plus.Engine.Filters}
         */
        var Filters = loader.resolve('Plus/Engine/Filters');
        var fs = new Filters();

        /**
         * Add the target filter
         */
        var filter = loader.resolve(self._namespace);
        fs.add(self._namespace, filter);
        var p = fs.apply(self._filter).then(function (output) {
            /**
             * Run the test
             */
            return callback.call(this, output);
        });
        assert.isPromise(p, done);
    });
};

/**
 * @param {*} input
 * @param {string} message
 * @param callback
 */
module.exports.skip = function(input, message, callback) {

};