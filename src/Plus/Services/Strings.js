var dependencies = ['lodash'];

define(dependencies, function (_) {

    /**
     * @name Plus.Services.Strings
     * @constructor
     */
    var Strings = function () {

    };

    /**
     * I'm not sure why this is needed?
     *
     * @param {string|undefined} value
     * @param {*} _default
     * @return {string|*}
     */
    Strings.prototype.get = function (value, _default) {
        if (_.isString(value) && value.trim() === '') {
            return _default;
        }
        return !!value ? value : _default;
    };

    /**
     * @param {string} str
     * @returns {string}
     */
    Strings.prototype.stripTags = function (str) {
        return str.replace(new RegExp('<\/?[^<>]*>', 'gi'), '');
    };

    /**
     * @param {string} str
     * @returns {string}
     */
    Strings.prototype.stripPunctuation = function (str) {
        return str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    };

    return new Strings();
});