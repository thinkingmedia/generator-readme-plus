var _ = require('lodash');

/**
 * @type {Plus.Loader}
 */
var Loader = new (require('../../src/Plus/Loader'))();

/***
 * @param {string} name
 * @param {Object} obj
 * @param {function} callback
 */
module.exports = function (name, obj, callback) {

    describe('mock with ' + name, function () {
        beforeEach(function () {
            if(!this.loader) {
                throw Error('mock can only be called inside a load() or filter()');
            }
            this.loader.replace(name, obj);
        });

        callback.call(this);
    });

};

module.exports.loader = null;