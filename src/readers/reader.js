var $fs = require('fs');

/**
 * @param {string} file
 *
 * @constructor
 */
var Reader = function(file)
{
	this._file = file;
};

/**
 * @returns {Section}
 */
Reader.prototype.getSections = function()
{
	var text = $fs.readFileSync(this._file,{'encoding': 'UTF-8'});
	this._process(text);
};

/**
 * @param {string} text
 * @abstract
 * @protected
 */
Reader.prototype._process = function(text)
{
	throw new Error('must be implemented by subclass!');
};

module.exports = Reader;