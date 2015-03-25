var _ = require('lodash');
var shell = require('shelljs');
var logger = require('winston');

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
				logger.error('git command line tool was not found.');
				return false;
			}
			var output = shell.exec('git config --local --list', {silent: true}).output.trim();
			this.cache = _.zipObject(_.map(_.compact(output.split("\n")), function(line)
			{
				return line.split("=");
			}));
			return this.valid = true;
		};

		/**
		 * Gets the username and repo name for the current working folder. Assumes it's a GitHub repo.
		 *
		 * @returns {{name:string,repo:string}|undefined}
		 */
		this.info = function()
		{
			var url = (this.cache && this.cache['remote.origin.url']) || undefined;
			return url
				? exports.getUserRepo(url)
				: undefined;
		};
	};
	return new plugin(options);
};

/*
 var info = $git.info();
 if(info)
 {
 if($fs.existsSync(this.work + '.travis.yml'))
 {
 var url = _.template('https://travis-ci.org/${user}/${repo}')(info);
 this.badges.build = this.badge('Build Status', url + '.svg', url);
 console.log('Travis: ' + url);
 }
 this.title = this.title || info.repo;
 this.github = _.template('https://github.com/${user}/${repo}')(info);
 }
 */

/**
 * Extracts the username/organization and repo name from a GitHub URL address.
 * Uses a simplified approach because Git urls can have a wide range of formats.
 *
 * @param {string} url
 * @returns {{name:string,repo:string}|undefined}
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
	return {
		'user': parts[0],
		'repo': parts[1]
	};
};
