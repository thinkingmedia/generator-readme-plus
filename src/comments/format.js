var $S = require('string');
var _ = require('lodash');

/**
 * @module Format
 */
var Format = {};

/**
 * Trims extra characters from lines of text that block out comments.
 *
 * @param {Array.<string>} lines
 */
Format.trim = function(lines)
{
	return _.map(lines, function(line)
	{
		line = line.trim();
		if($S(line).startsWith('*'))
		{
			line = line.substr(1).trim();
		}
		else if($S(line).startsWith('//'))
		{
			line = line.substr(2).trim();
		}
		return line;
	});
};

module.exports = Format;

