var _ = require('lodash');

/**
 * Trims extra characters from lines of text that block out comments.
 *
 * @param {Array.<string>} lines
 */
exports.trim = function(lines)
{
	if(!_.isArray(lines))
	{
		throw new Error('Expecting an error');
	}

	if(lines.length === 0)
	{
		return [];
	}

	if(lines.length === 1)
	{
		var line = lines[0];

		// empty comment on one line /**** *****/
		if(/\/[\*\s]+\//.test(line))
		{
			return [];
		}

		// extract text from between comment indicators /** example **/
		return [line.replace(/^\/\*+/, "").replace(/\*+\/$/, "").trim()];
	}

	// assume the first and last lines are start/end markers for a block comment
	lines = _.dropRight(_.drop(lines));

	return _.map(lines, function(line)
	{
		line = line.trim();
		if(_.startsWith(line, '*'))
		{
			line = line.substr(1).trim();
		}
		return line;
	});
};
