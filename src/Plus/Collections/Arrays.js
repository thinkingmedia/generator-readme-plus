define(['lodash'], function (_) {

    /**
     * @name Plus.Arrays
     *
     * @constructor
     */
    var Arrays = function () {

    };

    /**
     * Returns the first element of an array or the value if it is not an array.
     *
     * @param {*} value
     * @returns {*}
     */
    Arrays.firstIfArray = function (value) {
        if (_.isArray(value)) {
            return _.first(value);
        }
        return value;
    };

    return Arrays;
});
