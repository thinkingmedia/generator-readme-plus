var _ = require('lodash');
var $util = require('util');

/**
 * Extracts the lines between `@readme` and next annotation or end of comment.
 * Lines should be trimmed of comment characters.
 *
 * @see Format.trim
 * @param {Array.<string>} lines
 * @returns {Array.<string>|undefined}
 */
exports.getReadme = function(lines)
{
	if(!$util.isArray(lines))
	{
		throw new Error('Expected an array.');
	}

	// drop lines until we find a @readme
	lines = _.dropWhile(lines, function(line)
	{
		return !_.startsWith(line, '@readme');
	});

	if(lines.length == 0)
	{
		return undefined;
	}

	// keep lines until we find another annotation or end of comment
	var readme = _.first(lines);
	var markdown = _.takeWhile(_.drop(lines), function(line)
	{
		return !_.startsWith(line, '@');
	});

	markdown.unshift(readme);

	return markdown;
};