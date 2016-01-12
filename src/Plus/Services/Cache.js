/**
 * @returns {Plus.Services.Cache}
 * @ignore
 */
function Module() {

    /**
     * @memberof Plus.Services
     * @param {Date=} when The date/time when this instance was created.
     * @param {number=} ttl Numeric to persist the cache to disk.
     * @constructor
     */
    var Cache = function (when, ttl) {
        this._expires = null;
        this._ttl = parseInt(ttl);
        if (when instanceof Date && _.isNumber(this._ttl)) {
            this._expires = new Date(when);
            this._expires.setMinutes(this._expires.getMinutes() + this._ttl);
        }
        this.clear();
    };

    /**
     *
     */
    Cache.prototype.clear = function () {
        this._data = {};
    };

    /**
     * @returns {Date|null}
     */
    Cache.prototype.getExpires = function () {
        return this._expires;
    };

    /**
     * @returns {number}
     */
    Cache.prototype.getTTL = function() {
        return this._ttl;
    };

    /**
     * @returns {Object.<string,*>}
     */
    Cache.prototype.toObject = function () {
        return this._data;
    };

    /**
     * @param {string} key
     * @param {*} value
     */
    Cache.prototype.put = function (key, value) {
        this._data[key] = value;
    };

    /**
     * @param {string} key
     */
    Cache.prototype.remove = function (key) {
        delete this._data[key];
    };

    /**
     * @param {string} key
     * @returns {*}
     */
    Cache.prototype.get = function (key) {
        return this._data[key];
    };

    /**
     * @param {string} key
     * @returns {boolean}
     */
    Cache.prototype.has = function (key) {
        return this._data.hasOwnProperty(key);
    };

    return Cache;
}

module.exports = [
    Module
];