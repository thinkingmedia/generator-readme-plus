/**
 * Creates a badge image in markdown.
 *
 * @param {string} title
 * @param {string} img
 * @param {string} url
 * @returns {string}
 */
exports.badge = function(title, img, url)
{
    return _.template("[![${title}](${img})](${url})")({title: title, img: img, url: url});
};
