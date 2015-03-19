var $shell = require('shelljs');
var _ = require('lodash');

/**
 * @type {Object.<string,string>|null}
 */
var cache = null;

/**
 * Reads the git config for the repo in the current folder.
 * @returns {Object.<string,string>}
 */
exports.config = function()
{
	if(cache)
	{
		return cache;
	}
	// git is not installed
	if(!$shell.which('git'))
	{
		console.error('WARNING: git command line tool was not found.');
		return null;
	}
	var output = $shell.exec('git config --local --list', {silent: true}).output.trim();
	cache = _.zipObject(_.map(_.compact(output.split("\n")), function(line)
	{
		return line.split("=");
	}));
	return cache;
};

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
		return _.endsWith(part, ".git")
			? part.substr(0, part.indexOf('.git'))
			: part;
	}), 2);

	if(parts.length != 2)
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

/**
 * Gets the username and repo name for the current working folder. Assumes it's a GitHub repo.
 *
 * @returns {{name:string,repo:string}|undefined}
 */
exports.info = function()
{
	var url = (this.config() && this.config()['remote.origin.url']) || undefined;
	if(!url)
	{
		return undefined;
	}
	return this.getUserRepo(url);
};