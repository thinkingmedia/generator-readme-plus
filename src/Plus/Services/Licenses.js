/**
 * @param module
 * @param path
 * @param fs
 * @param _
 * @param {Plus.Services.Similarity} Similarity
 * @param {Plus.Files.Logger} Logger
 * @param {Plus.Services.Strings} Strings
 * @param {Array} LicenseTypes
 * @returns {Plus.Services.Licenses}
 * @ignore
 */
function Module(module, path, fs, _, Similarity, Logger, Strings, LicenseTypes) {

    /**
     * @memberof Plus.Services
     * @constructor
     */
    var Licenses = function () {

    };

    /**
     * @param {string} value
     * @returns {string}
     * @private
     */
    Licenses.prototype._trimBuffer = function (value) {
        value = value.replace(/[\r\n]/g, " ").replace(/\s+/g, " ");
        value = Strings.stripTags(value);
        value = Strings.stripPunctuation(value);
        return value.toLowerCase().replace(/\s+/g, " ").trim();
    };

    /**
     * @returns {string|null}
     */
    Licenses.prototype.getFileName = function () {
        var fileName = _.find(['LICENSE', 'LICENSE.txt', 'LICENSE.md'], function (fileName) {
            return fs.existsSync(fileName);
        });
        return fileName || null;
    };

    /**
     * @param {string} source
     * @returns {Object}
     * @private
     */
    Licenses.prototype._score = function (source) {
        return _.map(LicenseTypes, function (license) {
            var text = fs.readFileSync(path.dirname(module.uri) + "/_licenses/" + license.file, 'UTF8');
            if (!text) {
                throw Error("Unable to read license file: " + license.file);
            }
            text = this._trimBuffer(text);
            var score = Similarity.similarity(text, source);
            //Logger.debug("%s - %1.3f", license.file, score);
            Logger.debug("%s - %s", license.file, score);
            return _.merge({}, {score: score}, license);
        }.bind(this));
    };

    /**
     * @param {string} fileName
     */
    Licenses.prototype.getLicence = function (fileName) {

        var contents = fs.readFileSync(fileName, 'UTF8');
        if (!contents) {
            return null;
        }

        var file = this._trimBuffer(contents);
        var scored = this._score(file);

        var license = _.first(_.sortByOrder(scored, 'score', 'desc'));
        return license.score >= 0.95
            ? license
            : null;
    };

    /**
     * @param {string} type
     */
    Licenses.prototype.getLicenceByType = function (type) {
        return _.find(LicenseTypes, 'type', type);
    };

    return new Licenses();
}

module.exports = [
    'module',
    'path',
    'fs',
    'lodash',
    'Plus/Services/Similarity',
    'Plus/Files/Logger',
    'Plus/Services/Strings',
    'Plus/Services/_licenses/licenses.json',
    Module
];