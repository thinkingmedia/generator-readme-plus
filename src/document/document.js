var _ = require('lodash');
var $reader = require('../files/reader.js');
var $package = require('./package.js');
var $section = require('./section.js');

/**
 * @name Document
 *
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

	this.title = 'No Name';
	this.description = false;
	this.badges = {};
	this.sections = [];
	this.install = false;
	this.tests = false;
	this.authors = [];
	this.license = false;

	var json = $reader.readJson('package.json');
	if(json)
	{
		var _package = new $package(json);
		this.title = _package.data.title || this.title;
		this.description = _package.data.description || this.description;
		this.authors = _package.data.authors;
		this.license = _package.data.license || this.license;
	}
};

/**
 * Generates the final markdown for the readme.
 *
 * @returns {string}
 */
Document.prototype.toString = function()
{
	var sections = _.map(Object.keys(this._sections), function(name)
	{
		return this._sections[name];
	}, this);

	var text = '';
	_.each(_.sortBy(sections, 'name'), function(/** Section */section)
	{
		text += "#" + section.name + "\n";
		text += "\n";
		text += section.getLines().join("\n");
		text += "\n";
		text += "\n";
	});

	return text;
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