/**
 * @param {Plus.Services.Cache} Cache
 * @returns {Plus.Services.CacheFactory}
 */
function Module(Cache) {

    /**
     * @name Plus.Services.CacheFactory
     *
     * @constructor
     */
    var CacheFactory = function () {
        this.clear();
    };

    /**
     *
     */
    CacheFactory.prototype.clear = function() {
        this._caches = {};
    };

    /**
     * @param {string} name
     * @returns {Plus.Services.Cache}
     */
    CacheFactory.prototype.get = function (name) {
        if (!this._caches.hasOwnProperty(name)) {
            this._caches[name] = new Cache(name);
        }
        return this._caches[name];
    };

    /**
     * @param {string} fileName
     */
    CacheFactory.prototype.save = function (fileName) {

    };

    /**
     * @param {string} fileName
     */
    CacheFactory.prototype.load = function (fileName) {

    };

    return new CacheFactory();
}

module.exports = [
    'Plus/Services/Cache',
    Module
];