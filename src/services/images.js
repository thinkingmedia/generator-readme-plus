var _ = require('lodash');
var fs = require('fs');
var logger = require('winston');
var params = require('../params.js');
var sprintf = sprintf = require("sprintf-js").sprintf;

exports.create = function(options)
{
	var plugin = function(options)
	{
		this.name = 'images';
		this.valid = true;

		this.write = function(root, services)
		{
			var info = services.git.getInfo();
			if(!info)
			{
				return;
			}

			var types = ['png', 'jpg', 'gif'];
			var paths = _.map(types, function(type)
			{
				return params.work + info.repo + "." + type;
			});
			var image = _.find(paths, function(path)
			{
				return fs.existsSync(path);
			});
			if(!image)
			{
				return;
			}

			var url = sprintf("https://raw.githubusercontent.com/%s/%s/%s/%s", info.user, info.repo, info.branch, image);
			root.addImage('top', info.repo, url, true);
		}
	};
	return new plugin(options);
};
