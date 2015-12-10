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
			_.find(types, function(type)
			{
				var path = params.work + info.repo + "." + type;
				if(fs.existsSync(path))
				{
					var url = sprintf("https://raw.githubusercontent.com/%s/%s/%s/%s", info.user, info.repo, info.branch, info.repo +
																														  "." +
																														  type);
					root.addImage('top', info.repo, url, true);
					return true;
				}
				return false;
			});
		}
	};
	return new plugin(options);
};
