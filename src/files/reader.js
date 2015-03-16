var $fs = require('fs');

/**
 * @name Reader
 */
var Reader = {};

/**
 * Reads a file as a string.
 *
 * @param {string} file
 */
Reader.read = function(file)
{
	if(!$fs.existsSync(file))
	{
		return undefined;
	}
	return $fs.readFileSync(file, {'encoding': 'UTF-8'});
};

/**
 * Reads a file as a JSON object or array.
 *
 * @param {string} file
 * @returns {Object|Array|undefined}
 */
Reader.readJson = function(file)
{
	var json = this.read(file);
	try
	{
		if(json)
		{
			return JSON.parse(json);
		}
	}
	catch(e)
	{
		console.error("Unable to read JSON: " + file);
	}
	return undefined;
};

module.exports = Reader;