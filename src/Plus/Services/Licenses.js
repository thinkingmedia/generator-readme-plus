var dependencies = ['module', 'path', 'fs', 'lodash', 'Plus/Services/Similarity', 'Plus/Files/Logger', 'Plus/Services/Strings', './_licenses/licenses.json'];

define(dependencies, function (module, path, fs, _, /** Plus.Services.Similarity */Similarity, /**Plus.Files.Logger*/Logger, /**Plus.Services.Strings*/Strings, LicenseTypes) {

    /**
     * @name Plus.Services.Licenses
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

    return new Licenses();
});