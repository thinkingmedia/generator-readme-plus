var _ = require('lodash');

/**
 * @name Plus.Loader
 **
 * @constructor
 */
function Loader() {
    /**
     * @type {Object.<string,Object>}
     */
    this._cache = {};

    /**
     * @type {Plus.Files.Logger|null}
     */
    this.logger = null;
}

/**
 * Allows attachment of a logger after the loader has been created. So that the loader can be used to load the
 * logger.
 *
 * @param {Plus.Files.Logger} logger
 */
Loader.prototype.attach = function(logger) {
    this.logger = logger;
    this.logger && this.logger.debug('Loader:attach %s', !!logger);
};

/**
 * Resolves a module as either a node module or a Plus module. All paths that start with Plus are
 * handled using the resolve_module method.
 *
 * @param {string} path
 * @returns {*}
 */
Loader.prototype.resolve = function (path) {
    if (!path) {
        throw Error('invalid argument');
    }
    if (!this.isPlus(path)) {
        return require(path);
    }

    this.logger && this.logger.debug('Loader:resolve %s', path);

    if (this.isCached(path)) {
        return this.getCached(path);
    }

    var module = require(this.rewrite(path));

    if (!this.isJSON(path)) {
        module = this.resolve_module(module);
    }

    return this.setCache(path, module);
};

/**
 * Modules that export an array are handled as list of injectable to use as arguments for a function.
 * The return value of that function is than the module.
 *
 * @param {Array} module
 * @returns {Object}
 */
Loader.prototype.resolve_module = function (module) {
    if (!module) {
        throw Error('invalid argument');
    }
    if (!_.isArray(module)) {
        return module;
    }
    var inject = _.map(this.getValues(module), function (value) {
        return this.resolve(value);
    }.bind(this));
    return this.getMethod(module).apply(this, inject);
};

/**
 * Checks if the path ends with JSON file extension.
 *
 * @param {string} path
 * @returns {boolean}
 */
Loader.prototype.isJSON = function (path) {
    if (!path) {
        throw Error('invalid argument');
    }
    return _.endsWith(path, '.json');
};

/**
 * getValues returns all the injectable names the module function is expecting as arguments.
 *
 * @param {Array} values
 * @returns {string[]}
 */
Loader.prototype.getValues = function (values) {
    if (!_.isArray(values)) {
        throw Error('invalid argument');
    }
    if (values.length === 0) {
        throw Error('not enough items in array');
    }
    if (values.length === 1) {
        return [];
    }
    return values.slice(0, values.length - 1);
};

/**
 * getMethod returns the module function that was exported in the array.
 *
 * @param {Array} values
 * @returns {function}
 */
Loader.prototype.getMethod = function (values) {
    if (!_.isArray(values)) {
        throw Error('invalid argument');
    }
    if (values.length === 0) {
        throw Error('not enough items in array');
    }
    var method = _.last(values);
    if (!_.isFunction(method)) {
        throw Error('last item in array must be function');
    }
    return method;
};

/**
 * Checks if this loader has cached the module for the path. Only Plus modules are cached by this
 * loader.
 *
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
 * Assigns a module to the cache for a path.
 *
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
 * Gets a module from the cache. The module must exist in the cache.
 *
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
 * Rewrites an injectable reference to a relative path that can be used by node module loader.
 *
 * @param {string} path
 */
Loader.prototype.rewrite = function (path) {
    if (!path) {
        throw Error('invalid argument');
    }
    if (!this.isPlus(path)) {
        throw Error('not a namespace');
    }

    return './' + path.substr('Plus/'.length);
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