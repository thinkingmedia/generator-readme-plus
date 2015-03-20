var $fs = require('fs');
var _ = require('lodash');

var $section = require('../document/section.js');
var $format = require('../comments/format.js');
var $search = require('../comments/search.js');
var $annotations = require('../comments/annotations.js');

/**
 * @todo rename to comments
 *
 * @param {string} file
 *
 * @constructor
 */
exports.File = function(file)
{
	this._file = file;
};

/**
 * @todo Rename to get comments
 * @returns {Array.<exports.Detail>}
 */
exports.File.prototype.getSections = function()
{
	var text = $fs.readFileSync(this._file, {'encoding': 'UTF-8'});
	return this.findSections(text);
};


/**
 * @todo rename to find comments or just find
 * @param {string} text
 * @returns {Array.<exports.Detail>}
 */
exports.File.prototype.findSections = function(text)
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

		return new $section.Detail(name, markdown);
	}, this);

	return _.compact(sections);
};
