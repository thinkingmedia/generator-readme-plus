var _ = require('lodash');

/**
 * @param {string|undefined} value
 * @param {*} _default
 * @return {string|*}
 */
exports.get = function(value, _default)
{
	if(_.isString(value) && value.trim() === '')
	{
		return _default;
	}
	return !!value ? value : _default;
};

/**
 * @param {string} str
 * @returns {string}
 */
exports.stripTags = function(str)
{
	return str.replace(new RegExp('<\/?[^<>]*>', 'gi'), '');
};

/**
 * @param {string} str
 * @returns {string}
 */
exports.stripPunctuation = function(str)
{
	return str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
};

/**
 * @param {string} strA
 * @param {string} strB
 * @returns {number}
 * @see http://stackoverflow.com/questions/8451578/what-is-a-good-metric-for-deciding-if-2-strings-are-similar-enough
 */
exports.difference = function(strA, strB)
{
	function countLetters(str)
	{
		var letters = str.toLowerCase().replace(/\s/,"").split("");
		var count = {};
		_.each(letters,function(letter)
		{
			if(!count.hasOwnProperty(letter))
			{
				count[letter] = 0;
			}
			count[letter]++;
		});
		return count;
	}

	var countA = countLetters(strA);
	var countB = countLetters(strB);

	return 0.0;
};