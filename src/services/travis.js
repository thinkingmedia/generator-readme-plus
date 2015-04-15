var fs = require('fs');
var logger = require('winston');

var params = require('../params.js');
var reader = require('../files/reader.js');

exports.create = function(options)
{
	var plugin = function(options)
	{
		this.name = 'travis';
		this.valid = false;

		this.start = function()
		{
			this._file = reader.read(params.work + ".travis.yml");
			this._file && this.info('Found .travis.yml');
			return this.valid = true;
		};

		this.write = function(root, services)
		{
			var info = services.git.getInfo();
			if(!this._file || !info)
			{
				return;
			}
			var url = "https://travis-ci.org/" + info.user + "/" + info.repo;
			var img = url + ".svg?branch=master";
			root.addBadge('title', 'Build Status', img, url);
		}
	};
	return new plugin(options);
};
