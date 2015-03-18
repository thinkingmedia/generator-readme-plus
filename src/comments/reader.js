var $fs = require('fs');
var _ = require('lodash');

var $section = appRequire('document/section.js');
var $format = appRequire('comments/format.js');
var $search = appRequire('comments/search.js');
var $annotations = appRequire('comments/annotations.js');

/**
 * @param {string} file
 *
 * @constructor
 */
var Reader = function(file)
{
	this._file = file;
};

/**
 * @returns {Array.<Section>}
 */
Reader.prototype.getSections = function()
{
	var text = $fs.readFileSync(this._file, {'encoding': 'UTF-8'});
	return this.findSections(text);
};


/**
 * @param {string} text
 * @returns {Array.<Section>}
 * @abstract
 * @protected
 */
Reader.prototype.findSections = function(text)
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

		return new $section(name, markdown);
	}, this);

	return _.compact(sections);
};

module.exports = Reader;