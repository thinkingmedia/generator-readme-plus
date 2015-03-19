var _ = require('lodash');

/**
 * @readme
 *
 * Sections are chunks of text that appear in the table of contents. Each section has a name, title, blocks and sub-sections.
 *
 * @param {string} name
 * @param {Array.<string>=} lines
 *
 * @property {string} name
 * @property {Array.<string>} _lines
 *
 * @constructor
 */
exports.Detail = function(name, lines)
{
	if(_.startsWith(name, '@readme'))
	{
		name = name.replace(/^@readme/, "");
	}

	this.name = name.trim();
	this._lines = lines || [];
};

/**
 * Gets the lines of text for this section.
 *
 * @returns {Array.<string>}
 */
exports.Detail.prototype.getLines = function()
{
	var lines = _.map(this._lines, function(line)
	{
		return line.trim();
	});
	lines = _.dropWhile(lines, function(line)
	{
		return line == '';
	});
	return _.dropRightWhile(lines, function(line)
	{
		return line == '';
	});
};

/**
 * Appends a sections lines of text to this section.
 *
 * @param {exports.Detail} section
 */
exports.Detail.prototype.append = function(section)
{
	this._lines.push("\n");
	this._lines = this._lines.concat(section.getLines());
};
