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
	if(!_.isArray(lines))
	{
		throw new Error('Expecting an error');
	}

	if(lines.length == 0)
	{
		return [];
	}

	if(lines.length == 1)
	{
		// empty comment on one line /**** *****/
		if(/\/[\*\s]+\//.test(lines[0]))
		{
			return [];
		}
	}

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

