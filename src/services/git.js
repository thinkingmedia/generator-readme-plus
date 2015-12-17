var _ = require('lodash');
var fs = require('fs');
var shell = require('shelljs');
var logger = require('winston');
var sprintf = sprintf = require("sprintf-js").sprintf;
var params = require('../params.js');

exports.create = function(options)
{
	var plugin = function(options)
	{
		this.name = 'git';
		this.valid = false;

		this.start = function()
		{
			if(!shell.which('git'))
			{
				this.error('git command line tool was not found.');
				return false;
			}
			var output = shell.exec('git config --local --list', {silent: true}).output.trim();
			this.cache = _.zipObject(_.map(_.compact(output.split("\n")), function(line)
			{
				return line.split("=");
			}));

			if(this.cache['remote.origin.url'])
			{
				this.debug("remote.origin.url: %s", this.cache['remote.origin.url']);
			}

			return this.valid = true;
		};

		/**
		 * Test the default title for the readme.
		 */
		this.beforeWrite = function(root, services)
		{
			var info = this.getInfo();
			if(!info)
			{
				return;
			}
			root.setTitle(info.repo);
		};

		/**
		 * Gets the username and repo name for the current working folder. Assumes it's a GitHub repo.
		 *
		 * @returns {{user:string,repo:string,branch:string}|undefined}
		 */
		this.getInfo = function()
		{
			if(!this.cache)
			{
				return undefined;
			}
			if(!this.cache['remote.origin.url'])
			{
				this.error('"remote.origin.url" is missing from Git info.');
				return undefined;
			}
			return exports.getUserRepo(this.cache['remote.origin.url']);
		};

		/**
		 * Converts the path on the local drive to a URL on GitHub.
		 *
		 * @param {string} path
		 * @returns {string}
		 */
		this.convertPath = function(path)
		{
			var info = this.getInfo();
			if(!info)
			{
				return path;
			}

			path = fs.realpathSync(path).substr(params.work.length);
			path = path.replace(/\\/g,'/');
			return sprintf("https://github.com/%s/%s/blob/%s/%s", info.user, info.repo, info.branch, path);
		};
	};
	return new plugin(options);
};

/**
 * Extracts the username/organization and repo name from a GitHub URL address.
 * Uses a simplified approach because Git urls can have a wide range of formats.
 *
 * @param {string} url
 * @returns {{user:string,repo:string,branch:string}|undefined}
 */
exports.getUserRepo = function(url)
{
	if(url.indexOf('github.com') === -1)
	{
		return undefined;
	}

	url = url.trim().toLowerCase().replace("://", ":");
	if(url.indexOf('/') === -1)
	{
		return undefined;
	}
	var path = url.substr(url.indexOf('/') + 1);
	path = path.replace(/\?.*/, '');
	path = path.replace(/#.*/, '');

	// just get the first 2 levels
	var parts = _.take(_.map(path.split('/'), function(part)
	{
		return _.endsWith(part, ".git") ? part.substr(0, part.indexOf('.git')) : part;
	}), 2);

	if(parts.length !== 2)
	{
		// this isn't a valid url
		return undefined;
	}

	if(!parts[0] || !parts[1])
	{
		return undefined;
	}

	// assume first 2 levels are username and repo
	// @todo Figure out what branch this is.
	return {
		'user':   parts[0],
		'repo':   parts[1],
		'branch': 'master'
	};
};
