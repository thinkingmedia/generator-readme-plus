var _ = require('lodash');
var fs = require('fs');
var Q = require('q');
var shell = require('shelljs');
var logger = require('winston');
var sprintf = sprintf = require("sprintf-js").sprintf;
var GitHubApi = require('github');

var lines = require('../core/line.js');
var params = require('../params.js');

exports.create = function(options)
{
	var plugin = function(options)
	{
		this.name = 'github';
		this.valid = false;

		this.start = function()
		{
			this.api = new GitHubApi({
										 'version':  '3.0.0',
										 //'debug':    true,
										 'protocol': 'https',
										 'headers':  {
											 'user-agent': 'thinkingmedia/readme-plus'
										 }
									 });

			return this.valid = true;
		};

		/**
		 * Test the default title for the readme.
		 */
		this.write = function(root, services)
		{
			var info = services.git.getInfo();
			if(!info)
			{
				return;
			}

			var defer = Q.defer();
			this.api.repos.get({
								   'user': info.user,
								   'repo': info.repo
							   }, function(err, res)
							   {
								   if(err)
								   {
									   this.error(err);
									   return;
								   }
								   var url = res.homepage;

								   if(root.getContent().length === 0)
								   {
									   root.append(res.description);
								   }
								   defer.resolve();
							   }.bind(this));
			return defer.promise;
		};
	};
	return new plugin(options);
};
