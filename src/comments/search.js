var _ = require('lodash');

/**
 * @module Search
 */
var Search = {};

/**
 * Finds comments from source files that use the common comment blocks format. These things
 *
 * @param {string} text
 * @returns {Array.<Array.<string>>}
 */
Search.findComments = function(text)
{
	if(typeof text !== 'string')
	{
		throw new Error('Expected a string value.');
	}

	var comments = [];
	var current = false;
	_.each(text.split("\n"), function(line)
	{
		line = line.trim();
		if(line.match(/^\/\*/) && !current)
		{
			current = [];
		}
		if(current)
		{
			current.push(line);
		}
		if(line.match(/\*\/$/) && !!current)
		{
			comments.push(current);
			current = false;
		}
	});

	return comments;
};

module.exports = Search;