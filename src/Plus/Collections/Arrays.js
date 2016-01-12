/**
 * @param _
 * @returns {Plus.Collections.Arrays}
 * @ignore
 */
function Module(_) {

    /**
     * @memberof Plus.Collections
     * @constructor
     */
    var Arrays = function () {
    };

    /**
     * Joins an array of lines using the OS end of line character.
     *
     * @param {string[]} lines
     * @returns {string}
     */
    Arrays.prototype.toString = function (lines) {
        return lines.join('\n').trim();
    };

    /**
     * Calls trim on each string in the array.
     *
     * @param {string[]} lines
     * @returns {string[]}
     */
    Arrays.prototype.trimEach = function (lines) {
        return _.map(this.toArray(lines), function (line) {
            return _.isString(line)
                ? line.trim()
                : line;
        });
    };

    /**
     * Removes empty lines from the start and end of the array.
     *
     * @param {string[]} lines
     * @returns {string[]}
     */
    Arrays.prototype.trim = function (lines) {
        lines = this.toArray(lines);
        while (lines.length > 0 && lines[0] === '') {
            lines = _.slice(lines, 1);
        }
        while (lines.length > 0 && lines[lines.length - 1] === '') {
            lines = _.slice(lines, 0, lines.length - 1);
        }
        return lines;
    };

    /**
     * Converts the parameter to an array.
     *
     * @param {*} value
     * @returns {*}
     */
    Arrays.prototype.toArray = function (value) {
        if (value === null || typeof value === 'undefined') {
            return [];
        }
        return _.isArray(value)
            ? value
            : [value];
    };

    /**
     * Returns the first element of an array or the value if it is not an array.
     *
     * @param {*} value
     * @returns {*}
     */
    Arrays.prototype.first = function (value) {
        return _.first(this.toArray(value));
    };

    return new Arrays();
}

module.exports = [
    'lodash',
    Module
];