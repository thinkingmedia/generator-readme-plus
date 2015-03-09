var $S = require('string');
var $_ = require('lodash');
var $path = require('path');

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
 * A list of readers that exist in the module.
 *
 * @type {{ext: string, module: string}[]}
 */
Readers.prototype.$readers = [
	{
		'ext':    '.js',
		'module': __dirname + $path.sep + 'jsdoc.js'
	},
	{
		'ext':    '.php',
		'module': __dirname + $path.sep + 'phpdoc.js'
	},
	{
		'ext':    '.cs',
		'module': __dirname + $path.sep + 'csdoc.js'
	}
];

/**
 * Checks if a file has an associated reader.
 * @param {string} file
 */
Readers.prototype.hasReader = function(file)
{
	return $_.any(this.$readers, function(reader)
	{
		return $S(file).endsWith(reader.ext);
	});
};

/**
 * Provides a reader for a file.
 *
 * @param file
 */
Readers.prototype.getReader = function(file)
{
	var reader = $_.find(this.$readers,function(reader)
	{
		if(!$S(file).endsWith(reader.ext))
		{
			return false;
		}
		return reader;
	});
	var constructor = require(reader.module);
	return new constructor(file);
};

module.exports = new Readers();