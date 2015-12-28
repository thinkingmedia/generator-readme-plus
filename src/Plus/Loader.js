var _ = require('lodash');

/**
 * @name Plus.Loader
 *
 * @property {Plus.Loader} instance
 *
 * @constructor
 */
function Loader() {
    /**
     * @type {Object.<string,Object>}
     */
    this._cache = {};

    this.instance = this;
}

/**
 * @param {string} path
 * @returns {Object}
 */
Loader.prototype.resolve = function (path) {
    if (!this.isPlus(path)) {
        return require(path);
    }
    return this.isCached(path)
        ? this.getCached(path)
        : this.setCache(path, require(this.rewrite(path)));
};

/**
 * @param {string} path
 * @returns {boolean}
 */
Loader.prototype.isCached = function (path) {
    if (!path) {
        throw Error('invalid argument');
    }
    return this._cache.hasOwnProperty(path);
};

/**
 * @param {string} key
 * @param {Object} value
 * @returns {Object}
 */
Loader.prototype.setCache = function (key, value) {
    if (!key) {
        throw Error('invalid argument');
    }
    return this._cache[key] = value;
};

/**
 * @param {string} key
 * @returns {Object}
 */
Loader.prototype.getCached = function (key) {
    if (!key) {
        throw Error('invalid argument');
    }
    if (!this.isCached(key)) {
        throw Error(key + ' is not cached.')
    }
    return this._cache[key];
};

/**
 * @param {string} path
 */
Loader.prototype.rewrite = function (path) {
    if (!path) {
        throw Error('invalid argument');
    }
    if (!this.isPlus(path)) {
        throw Error('not a namespace');
    }
    return './' + path;
};

/**
 * Checks if a path is a Plus namespace.
 *
 * @param {string} path
 * @returns {boolean}
 */
Loader.prototype.isPlus = function (path) {
    if (!path) {
        throw Error('invalid argument');
    }
    return _.startsWith(path, 'Plus/') && !_.endsWith(path, '/');
};

/**
 * Replaces a cached reference with a new object.
 *
 * @param {string} path
 * @param {Object} obj
 */
Loader.prototype.replace = function (path, obj) {
    if (!path) {
        throw Error('invalid argument');
    }
    this._cache[path] = obj;
};

module.exports = Loader;