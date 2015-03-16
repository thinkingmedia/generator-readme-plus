var _ = require('lodash');
var $reader = require('../files/reader.js');
var $section = require('./section.js');
var $package = require('./package.js');
var $git = require('./git.js');
var $fs = require('fs');
var $path = require('path');

/**
 * @name ReadmeDocument
 * @readme
 *
 * Readme generates an internal document before the template is rendered. This document contains data and text extracted
 * from different files in the current project directory.
 *
 * @param {string} work The user's git working folder.
 * @param {string} src The path to the source code.
 */
var Document = function(work, src)
{
	this.work = $path.join(work, '/');
	this.src = $path.join(src, '/');

	this._sections = {};

	/**
	 * @type {string}
	 */
	this.title = 'No Name';

	/**
	 * @type {string|undefined}
	 */
	this.description = undefined;

	this.badges = {
		'build':     '',
		'coverage':  '',
		'license':   '',
		'install':   '',
		'downloads': ''
	};
	this.sections = [];
	this.install = false;
	this.tests = false;

	/**
	 * @type {Array.<{name:string,email:string,url:string}>}
	 */
	this.authors = [];

	/**
	 * @type {{type:string,url:string}|undefined}
	 */
	this.license = undefined;

	var json = $reader.readJson(this.work + 'package.json');
	if(json)
	{
		var data = $package.format(json);
		this.title = data.title || this.title;
		this.description = data.description || this.description;
		this.authors = data.authors;
		this.license = data.license || this.license;
	}

	var info = $git.info();
	if(info)
	{
		if($fs.existsSync(this.work + '.travis.yml'))
		{
			var url = _.template('https://travis-ci.org/${user}/${repo}')(info);
			this.badges.build = this.badge('Build Status', url + '.svg', url);
			console.log('Travis: ' + url);
		}
	}
};

/**
 * Creates a badge image in markdown.
 *
 * @param {string} title
 * @param {string} img
 * @param {string} url
 * @returns {string}
 */
Document.prototype.badge = function(title, img, url)
{
	return _.template("[![${title}](${img})](${url})")({title: title, img: img, url: url});
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

module.exports = Document;