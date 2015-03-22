var _ = require('lodash');
var fs = require('fs');
var logger = require('winston');

var section = require('../document/section.js');
var format = require('../comments/format.js');
var search = require('../comments/search.js');
var annotations = require('../comments/annotations.js');
var reader = require('../files/reader.js');

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

		this.getSections = function(file)
		{
			var text = reader.read(file) || '';
			var comments = search.findComments(text);

			logger.debug('Comments: %d', comments.length);

			return _.compact(_.map(comments, function(comment)
			{
				var trimmed = format.trim(comment);
				return annotations.getReadme(trimmed);
			}));
		};

		this.read = function(file)
		{
			var comments = this.getSections(file);
			_.each(comments,function(comment)
			{
				var name = _.first(comment);
				var markdown = _.drop(comment);
				section.root.child(name).append(markdown);
			});
		};
	};

	return new plugin(options);
};