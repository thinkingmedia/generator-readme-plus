var $S = require('string');
var $_ = require('lodash');
var $path = require('path');
var $fs = require('fs');

/**
 * @param {string} path
 * @param {function(string)} callback
 */
var _work = function(path, callback)
{
	$_.each($fs.readdirSync(path).sort(), function(file)
	{
		if($S(file).startsWith("."))
		{
			return;
		}
		var fullPath = path + $path.sep + file;
		var stats = $fs.statSync(fullPath);
		if(stats.isDirectory())
		{
			_work(fullPath, callback);
			return;
		}
		callback(fullPath);
	}, this);
};

/**
 * @readme Crawler
 *
 * Recursively crawls a directory calling a callback for each file found.
 *
 * @constructor
 */
var Crawler = function(path)
{
	path = $fs.realpathSync(path);

	if(!$fs.existsSync(path))
	{
		throw new Error('Directory does not exist');
	}

	this._path = path;
};

/**
 * Calls the callback for each file found in a recursive search of directories.
 *
 * @param {function(string)} callback
 */
Crawler.prototype.walk = function(callback)
{
	_work(this._path, callback);
};

module.exports = Crawler;