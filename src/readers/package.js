var $S = require('string');
var $_ = require('lodash');
var $path = require('path');
var $fs = require('fs');

/**
 * @readme Readers
 *
 * Readme uses a collection of readers for different programming languages. Allowing the tool
 * to extra text for the readme directly from the source code comments.
 *
 * @constructor
 */
var Readers = function()
{
};

/**
 * Recursively finds all files and their associated readers.
 *
 * @param {string} path
 * @param {function(string,Object)} callback
 */
Readers.prototype.crawl_files = function(path, callback)
{
	$_.each($fs.readdirSync(path), function(file)
	{
		if($S(file).startsWith("."))
		{
			return;
		}
		var fullPath = path + $path.sep + file;
		var stats = $fs.statSync(fullPath);
		if(stats.isDirectory())
		{
			this.crawl_files(fullPath, callback);
			return;
		}
		var reader = this.getReader(fullPath);
		if(reader)
		{
			callback(fullPath, reader);
		}
	}.bind(this));
};

/**
 * Loads a reader dynamically based upon the file extension.
 *
 * @param {string} file
 * @returns {Object|undefined}
 */
Readers.prototype.getReader = function(file)
{
	var ext = $S($path.extname(file).toLowerCase()).chompLeft('.');
	var reader_file = __dirname + $path.sep + ext + '_reader.js';
	try
	{
		var $reader = require(reader_file);
		return new $reader(file);
	}
	catch(error)
	{
		return undefined;
	}
};

module.exports = new Readers();