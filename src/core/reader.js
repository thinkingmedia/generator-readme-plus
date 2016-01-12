//var _ = require('lodash');
//var fs = require('fs');
//var logger = require('winston');
//var sprintf = sprintf = require("sprintf-js").sprintf;
//
//var coreSource = require('../core/source_code.js');
//var coreTag = require('../core/tag.js');
//
//var reader = require('../files/reader.js');
//var params = require('../params.js');
//
///**
// * @param options
// */
//exports.create = function(options)
//{
//	var plugin = function(options)
//	{
//		this.name = options.name || 'n/a';
//		this.include = options.include;
//		this.exclude = options.exclude;
//		this.useSource = true;
//		this.valid = false;
//
//		this.start = function()
//		{
//			this.valid = true;
//			return true;
//		};
//
//		this.read = function(path, root, services)
//		{
//			var file = coreSource.create(path);
//			if(!file)
//			{
//				return;
//			}
//			var comments = file.getComments();
//			if(comments.length !== 0)
//			{
//				this.info(path);
//				this.debug('Comments: %d', comments.length);
//			}
//
//			_.each(comments, function(/** exports.Comment */comment)
//			{
//				_.each(coreTag.create(comment, 'readme'), function(/** exports.Tag */tag)
//				{
//					this.info(tag.getTitle() ? "%s \"%s\"" : "%s", tag.getName() || 'ROOT', tag.getTitle());
//
//					var child = tag.getName() ? root.child(tag.getName()) : root;
//					if(tag.getTitle())
//					{
//						child.title = tag.getTitle();
//					}
//
//					var lines = tag.getLines();
//					if(lines.length === 0)
//					{
//						return;
//					}
//					child.append(lines);
//
//					var info = services.git.getInfo();
//					if(!params.trace || !info)
//					{
//						return;
//					}
//
//					var url = services.git.convertPath(tag.getFile());
//					url = sprintf("%s#L%d", url, tag.getNum());
//					child.addLink('trace', '*', url, true);
//				}, this);
//			}, this);
//		};
//	};
//
//	return new plugin(options);
//};