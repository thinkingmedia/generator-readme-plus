var $S = require('string');
var $section = require('../document/section.js');
var $util = require('util');
var _ = require('lodash');

var $reader = require('./reader.js');

/***********************************************
 * @constructor
 * @extends Reader
 *
 * @readme Readers
 *
 * Readme will extract text from JavaScript source code files.
 *
 * @param {string} file
 ***********************************************/
var JsDocReader = function(file)
{
	JsDocReader.super_.call(this, file);
};
$util.inherits(JsDocReader, $reader);

/**
 * @see Reader._process
 */
JsDocReader.prototype._process = function(text)
{
	var comments = this._findComments(text);

	var sections = _.map(comments, function(comment)
	{
		var readme = this._getReadme(comment);
		if(readme.length == 0)
		{
			return null;
		}
		return new $section('test');
	}, this);

	return _.filter(sections,function(section) { return !!section; });
};

/**
 * Extras the lines between `@readme` and next annotation or end of comment.
 *
 * @param {Array.<string>} comment
 * @returns {Array.<string>}
 * @private
 */
JsDocReader.prototype._getReadme = function(comment)
{
	// trim each line
	var lines = _.map(comment, function(line)
	{
		return line.trim().substr(1).trim();
	});

	// drop lines until we find a @readme
	lines = _.dropWhile(lines, function(line)
	{
		return !$S(line).startsWith('@readme ');
	});

	// keep lines until we find another annotation or end of comment
	lines = _.takeWhile(lines, function(line)
	{
		return !$S(line).startsWith('@');
	});

	return lines;
};

/**
 * Extras the comments from the JS
 *
 * @param {string} text
 * @returns {Array.<Array.<string>>}
 * @private
 */
JsDocReader.prototype._findComments = function(text)
{
	var comments = [];
	var current = false;
	_.each(text.split("\n"), function(line)
	{
		line = line.trim();
		if(line.match(/^\/\*/) && !current)
		{
			current = [];
		}
		if(current)
		{
			current.push(line);
		}
		if(line.match(/\*\/$/) && !!current)
		{
			comments.push(current);
			current = false;
		}
	});

	return comments;
};

module.exports = JsDocReader;