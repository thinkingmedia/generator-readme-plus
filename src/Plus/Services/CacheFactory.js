/**
 * @param _
 * @param fs
 * @param {Plus.Services.Cache} Cache
 *
 * @returns {Plus.Services.CacheFactory}
 */
function Module(_, fs, Cache) {

    /**
     * @name Plus.Services.CacheFactory
     *
     * @constructor
     */
    var CacheFactory = function () {
        this.clear();
    };

    /**
     * @returns {number}
     */
    CacheFactory.prototype.count = function () {
        return _.keys(this._caches).length;
    };

    /**
     *
     */
    CacheFactory.prototype.clear = function () {
        this._caches = {};
    };

    /**
     * @param {string} name
     * @returns {boolean}
     */
    CacheFactory.prototype.has = function (name) {
        return this._caches.hasOwnProperty(name);
    };

    /**
     * @param {string} name
     * @param {Date=} when
     * @param {number=} ttl
     *
     * @returns {Plus.Services.Cache}
     */
    CacheFactory.prototype.create = function (name, when, ttl) {
        if (!_.isString(name) || name == '') {
            throw Error('invalid cache name');
        }
        if (this._caches.hasOwnProperty(name)) {
            throw Error('cache ' + name + ' already exists.');
        }
        this._caches[name] = new Cache(when, ttl);
        return this._caches[name];
    };

    /**
     * @param {string} name
     *
     * @returns {Plus.Services.Cache}
     */
    CacheFactory.prototype.get = function (name) {
        if (!this._caches.hasOwnProperty(name)) {
            throw Error('cache ' + name + ' not found.');
        }
        return this._caches[name];
    };


    /**
     * @returns {Object.<string,Object>}
     */
    CacheFactory.prototype.toObject = function () {
        var result = {
            version: 1,
            caches: []
        };
        _.each(this._caches, function (value, key) {
            var expires = value.getExpires();
            if (expires === null) {
                return;
            }
            result.caches.push({
                name: key,
                expires: expires.toGMTString(),
                ttl: value.getTTL(),
                data: value.toObject()
            });
        });
        return result;
    };

    /**
     * @param {{version:number,caches:Object[]}} obj
     */
    CacheFactory.prototype.fromObject = function (obj) {
        this.clear();

        if (obj.version !== 1) {
            throw Error('unsupported version');
        }

        if (!_.isArray(obj.caches)) {
            throw Error('expected an array');
        }

        _.each(obj.caches, function (value) {

            if (!value.expires
                || !value.data
                || !value.name
                || !value.ttl) {
                throw Error('unexpected data in cache file.');
            }

            // skip if expired
            var expires = new Date(value.expires);
            if (expires.valueOf() < Date.now().valueOf()) {
                return;
            }

            var cache = this.create(value.name, new Date(), value.ttl);
            _.each(value.data, function (value, /**string*/key) {
                cache.put(key, value);
            });
        }.bind(this));
    };

    /**
     * @param {string} fileName
     */
    CacheFactory.prototype.save = function (fileName) {
        if (!_.isString(fileName) || fileName === '') {
            throw Error('invalid fileName');
        }
        var str = JSON.stringify(this.toObject());
        fs.writeFileSync(fileName, str, 'UTF8');
    };

    /**
     * @param {string} fileName
     */
    CacheFactory.prototype.load = function (fileName) {
        if (!_.isString(fileName) || fileName === '') {
            throw Error('invalid fileName');
        }
        var str = fs.readFileSync(fileName, 'UTF8');
        if (!_.startsWith(str, '{')) {
            throw Error('invalid file: ' + fileName);
        }
        try {
            var obj = JSON.parse(str);
            this.fromObject(obj);
        } catch (e) {
            throw Error('could not read file: ' + e.message);
        }
    };

    return new CacheFactory();
}

module.exports = [
    'lodash',
    'fs',
    'Plus/Services/Cache',
    Module
];