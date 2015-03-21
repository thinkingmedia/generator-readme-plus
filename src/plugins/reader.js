var fs = require('fs');
var _ = require('lodash');

var section = require('../document/section.js');

var format = require('../comments/format.js');
var search = require('../comments/search.js');
var annotations = require('../comments/annotations.js');

exports.create = function(options)
{
	var plugin = function(options)
	{
		this.name = 'reader';
		this.include = options.include;
		this.exclude = options.exclude;
		this.useSource = true;
		this.valid = false;

		this.start = function()
		{
			this.valid = true;
			return true;
		};

		this.read = function(file)
		{
			var text = fs.readFileSync(file, 'utf8');
			var comments = search.findComments(text);
			_.each(comments, function(comment)
			{
				var trimmed = format.trim(comment);
				var readme = annotations.getReadme(trimmed);
				if(_.isUndefined(readme))
				{
					return null;
				}

				var name = _.first(readme);
				var markdown = _.drop(readme);

				section.root.child(name).append(markdown);
			});
		};

		this.stop = function()
		{
		};

		this.usage = function()
		{
		};
	};

	return new plugin(options);
};

/**
 * @todo rename to comments
 * @todo this is a processor of giles. it should publish what type of files it processes.
 * @todo should this know how to find those files? or should a different plugin handle the searching?
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
	var text = fs.readFileSync(this._file, {'encoding': 'UTF-8'});
	return this.findSections(text);
};

/**
 * @todo rename to find comments or just find
 * @param {string} text
 * @returns {Array.<exports.Detail>}
 */
exports.File.prototype.findSections = function(text)
{
	var comments = search.findComments(text);
	var sections = _.map(comments, function(comment)
	{
		var trimmed = format.trim(comment);
		var readme = annotations.getReadme(trimmed);
		if(typeof readme === 'undefined')
		{
			return null;
		}

		var name = _.first(readme);
		var markdown = _.drop(readme);

		return new section.Detail(name, markdown);
	}, this);

	return _.compact(sections);
};
