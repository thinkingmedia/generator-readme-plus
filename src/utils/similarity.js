var _ = require('lodash');

/**
 * @param {string} str
 * @returns {Object.<string,number>}
 */
exports.termFreqMap = function(str)
{
	var words = str.split(' ');
	var termFreq = {};
	_.each(words, function(w)
	{
		termFreq[w] = (termFreq[w] || 0) + 1;
	});
	return termFreq;
};

/**
 * @param {Object.<string,number>} map
 * @param {Object.<string,boolean>} dict
 */
exports.addKeysToDict = function(map, dict)
{
	_.each(map, function(value,key)
	{
		dict[key] = true;
	});
};

/**
 * @param {Object.<string,number>} map
 * @param {Object.<string,boolean>} dict
 * @returns {Array.<number>}
 */
exports.termFreqMapToVector = function(map, dict)
{
	var termFreqVector = [];
	_.each(dict, function(value,key)
	{
		termFreqVector.push(map[key] || 0);
	});
	return termFreqVector;
};

/**
 * @param {Array.<number>} vecA
 * @param {Array.<number>} vecB
 * @returns {number}
 */
exports.vecDotProduct = function(vecA, vecB)
{
	var product = 0;
	for(var i = 0; i < vecA.length; i++)
	{
		product += vecA[i] * vecB[i];
	}
	return product;
};

/**
 * @param {Array.<number>} vec
 * @returns {number}
 */
exports.vecMagnitude = function(vec)
{
	var sum = 0;
	for(var i = 0; i < vec.length; i++)
	{
		sum += vec[i] * vec[i];
	}
	return Math.sqrt(sum);
};

/**
 * @param {Array.<number>} vecA
 * @param {Array.<number>} vecB
 * @returns {number}
 */
exports.cosineSimilarity = function(vecA, vecB)
{
	return exports.vecDotProduct(vecA, vecB) / (exports.vecMagnitude(vecA) * exports.vecMagnitude(vecB));
};

/**
 * @param {string} strA
 * @param {string} strB
 * @returns {number}
 */
exports.similarity = function(strA, strB)
{
	var termFreqA = exports.termFreqMap(strA);
	var termFreqB = exports.termFreqMap(strB);

	var dict = {};
	exports.addKeysToDict(termFreqA, dict);
	exports.addKeysToDict(termFreqB, dict);

	var termFreqVecA = exports.termFreqMapToVector(termFreqA, dict);
	var termFreqVecB = exports.termFreqMapToVector(termFreqB, dict);

	return exports.cosineSimilarity(termFreqVecA, termFreqVecB);
};