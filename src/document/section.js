/**
 * @readme
 *
 * Sections are chunks of text that appear in the table of contents. Each section has a name, title, blocks and sub-sections.
 *
 * @param {string} name
 * @param {Array.<string>} lines
 *
 * @property {string} name
 * @property {Array.<string>} lines
 *
 * @constructor
 */
var Section = function(name, lines)
{
	this.name = name;
	this.lines = lines;
};

module.exports = Section;