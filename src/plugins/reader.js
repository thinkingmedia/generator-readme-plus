var _ = require('lodash');
var fs = require('fs');
var logger = require('winston');

var coreSource = require('../core/source_code.js');
var coreTag = require('../core/tag.js');

var section = require('../document/section.js');
var reader = require('../files/reader.js');

/**
 * @readme
 *
 * This is a test.
 *
 * @param options
 */
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

		this.read = function(path, root, services)
		{
			var file = coreSource.create(path);
			if(!file)
			{
				return;
			}
			var comments = file.getComments();
			if(comments.length !== 0)
			{
				logger.info(path);
				logger.debug('Comments: %d', comments.length);
			}

			_.each(comments, function(/** exports.Comment */comment)
			{
				_.each(coreTag.create(comment, 'readme'),function(/** exports.Tag */tag)
				{
					logger.info(tag.getTitle() ? "%s \"%s\"" : "%s", tag.getName() || 'ROOT', tag.getTitle());

					var child = root.child(tag.getName() || 'ROOT');
					child.title = tag.getTitle() || tag.getName();

					var lines = tag.getLines();
					if(lines.length > 0)
					{
						child.append(lines);
						child.trace(tag.getFile(), lines[0].getNum());
					}
				});
			});
		};
	};

	return new plugin(options);
};