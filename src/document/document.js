/**
 * @type {Section}
 */
var $section = require('./section.js');

/**
 * @readme
 *
 * Readme generates an internal document before the template is rendered. This document contains data and text extracted
 * from different files in the current project directory.
 *
 * @constructor
 */
var Document = function()
{
	this._sections = {};
};

/**
 * Finds a section by it's name. If the section does not exist a new section is added to the document.
 *
 * @param {string} name
 * @returns {Section}
 */
Document.prototype.getSection = function(name)
{
	if(!this._sections.hasOwnProperty(name))
	{
		this._sections[name] = new $section(name);
	}
	return this._sections[name];
};

module.exports = new Document();