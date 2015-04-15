var _ = require('lodash');
var fs = require('fs');
var logger = require('winston');

/**
 * Reads a file as a string. Returns undefined if the file does not exist.
 *
 * @param {string} file
 * @returns {string|undefined}
 */
exports.read = function(file)
{
	if(!file)
	{
		return undefined;
	}
	if(fs.existsSync(file))
	{
		return fs.readFileSync(file, 'utf8');
	}
	return undefined;
};

/**
 * Reads the first file that exists in the array.
 *
 * @param {Array.<string>} files
 */
exports.readFirst = function(files)
{
	var file = _.find(files,function(file)
	{
		return fs.existsSync(file);
	});
	return exports.read(file);
};

/**
 * Reads a file as a JSON object or array.
 *
 * @param {string} file
 * @returns {Object|Array|undefined}
 */
exports.readJson = function(file)
{
	var json = this.read(file);
	try
	{
		if(json)
		{
			return JSON.parse(json);
		}
	}
	catch(ex)
	{
		logger.error(ex.message);
		logger.debug(ex.stack);
	}
	return undefined;
};
