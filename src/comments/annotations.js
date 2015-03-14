var $S = require('string');
var _ = require('lodash');
var $util = require('util');

/**
 * @type {Format}
 */
var $format = require('./format.js');

/**
 * @module Annotations
 */
var Annotations = {};

/**
 * Extracts the lines between `@readme` and next annotation or end of comment.
 * Lines should be trimmed of comment characters.
 *
 * @see Format.trim
 * @param {Array.<string>} lines
 * @returns {Array.<string>|undefined}
 */
Annotations.getReadme = function(lines)
{
	if(!$util.isArray(lines))
	{
		throw new Error('Expected an array.');
	}

	// drop lines until we find a @readme
	lines = _.dropWhile(lines, function(line)
	{
		return !$S(line).startsWith('@readme');
	});

	if(lines.length == 0)
	{
		return undefined;
	}

	// keep lines until we find another annotation or end of comment
	var readme = _.first(lines);
	var markdown = _.takeWhile(_.drop(lines), function(line)
	{
		return !$S(line).startsWith('@');
	});

	markdown.unshift(readme);

	return markdown;
};

module.exports = Annotations;