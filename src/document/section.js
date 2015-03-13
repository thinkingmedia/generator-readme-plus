/**
 * @readme
 *
 * Sections are chunks of text that appear in the table of contents. Each section has a name, title, blocks and sub-sections.
 *
 * @param {string} name
 *
 * @property {Array.<Block>} _blocks
 *
 * @constructor
 */
var Section = function(name)
{
	this._name = name;
	this._title = false;
	this._blocks = [];
};

/**
 * Appends text to this section in the document.
 *
 * @param {string} text
 */
Section.prototype.append = function(text)
{
	this._blocks.push(text);
};

module.exports = Section;