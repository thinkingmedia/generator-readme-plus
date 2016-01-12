var reader = require('../files/reader.js');
var line = require('./line.js');
var comment = require('./comment.js');

/**
 * @param {string} file The name of the file
 * @param {string} text The contents of the file
 * @constructor
 */
exports.SourceCode = function(file, text)
{
	this._file = file;
	this._text = text;
	this._lines = line.create(text);
	this._comments = comment.create(file,this._lines);
};

/**
 * @returns {Array.<exports.Comment>}
 */
exports.SourceCode.prototype.getComments = function()
{
	return this._comments;
};

/**
 * @param {string} path
 * @returns {exports.SourceCode|undefined}
 */
exports.create = function(path)
{
	var text = reader.read(path);
	if(text)
	{
		return new exports.SourceCode(path, text);
	}
	return undefined;
};