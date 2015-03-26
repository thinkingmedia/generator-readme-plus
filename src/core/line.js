var _ = require('lodash');

/**
 * Represents a line of text from a file.
 * @constructor
 */
exports.Line = function(num, text)
{
	this._num = num;
	this._text = text;
};

/**
 * @returns {number}
 */
exports.Line.prototype.getNum = function()
{
	return this._num;
};

/**
 * @param {string} text
 * @returns {exports.Line}
 */
exports.Line.prototype.setText = function(text)
{
	this._text = text;
	return this;
};

/**
 * @returns {string}
 */
exports.Line.prototype.getText = function()
{
	return this._text;
};

/**
 * @returns {exports.Line}
 */
exports.Line.prototype.clone = function()
{
	return new exports.Line(this._num, this._text);
};

/**
 * @returns {string}
 */
exports.Line.prototype.unescape = function()
{
	return this._text.replace(/\\(?!\\)/g, '').replace(/\\\\/g, '\\');
};

/**
 * @param {string} text
 * @returns {Array.<exports.Line>}
 */
exports.create = function(text)
{
	var num = 1;
	return _.map(text.split("\n"), function(str)
	{
		return new exports.Line(num++, str.trim());
	});
};
