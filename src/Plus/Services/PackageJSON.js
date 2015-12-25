var dependencies = ['module', 'path', 'fs', 'require'];

define(dependencies, function (module, path, fs, require) {

    /**
     * @name Plus.Services.PackageJSON
     * @param {string} fileName
     * @constructor
     */
    var PackageJSON = function (fileName) {
        this._fileName = fileName;
        this._load = true;
        this._json = null;
    };

    /**
     * Loads and caches the package.json file.
     *
     * @returns {Object}
     * @private
     */
    PackageJSON.prototype._get = function () {
        if (this._load) {
            this._load = false;
            if (fs.existsSync(this._fileName)) {
                this._json = require(this._fileName);
            }
        }
        return this._json;
    };

    /**
     * @returns {boolean}
     */
    PackageJSON.prototype.hasPackage = function () {
        return !!this._get();
    };

    /**
     * @param {*} value
     * @returns {string|null}
     * @private
     */
    PackageJSON.prototype._readLicence = function (value) {
        if (_.isString(value)) {
            return value;
        }
        if (_.isObject(value) && _.isString(value['type'])) {
            return value['type'];
        }
        if (_.isArray(value)) {
            return this._readLicence(_.first(value));
        }
        return null;
    };

    /**
     * @returns {string|null}
     */
    PackageJSON.prototype.getLicenceType = function () {
        var json = this._get();
        var licence = json && json['licence'];
        if (!licence) {
            return null;
        }
        return this._readLicence(licence);
    };

    return new PackageJSON(path.dirname(module.uri) + path.sep + "package.json");
});