/**
 * @param _
 * @returns {Plus.Services.Badges}
 */
function Module(_) {

    /**
     * @name Plus.Services.Badges
     *
     * @constructor
     */
    var Badges = function () {

    };

    /**
     * Creates a badge image in markdown.
     *
     * @param {string} title
     * @param {string} img
     * @param {string} url
     * @returns {string}
     */
    Badges.prototype.create = function (title, img, url) {
        return _.template("[![${title}](${img})](${url})")({title: title, img: img, url: url});
    };

    return new Badges();
}

module.exports = [
    'lodash',
    Module
];