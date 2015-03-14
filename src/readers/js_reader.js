var $util = require('util');
var _ = require('lodash');

var $section = require('../document/section.js');
var $format = require('../comments/format.js');
var $search = require('../comments/search.js');
var $annotations = require('../comments/annotations.js');

var $reader = require('./reader.js');

/**
 * @constructor
 * @extends Reader
 *
 * @readme Readers
 *
 * Readme will extract text from JavaScript source code files.
 *
 * @param {string} file
 */
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
	var comments = $search.findComments(text);
	var sections = _.map(comments, function(comment)
	{
		var trimmed = $format.trim(comment);
		var readme = $annotations.getReadme(trimmed);
		if(typeof readme === 'undefined')
		{
			return null;
		}

		var name = _.first(readme);
		var markdown = _.drop(readme);
		return new $section(name,markdown);
	}, this);

	return _.filter(sections,function(section) { return !!section; });
};

module.exports = JsDocReader;