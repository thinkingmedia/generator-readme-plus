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
 * @returns {Array.<Section>}
 */
Reader.prototype.getSections = function()
{
	var text = $fs.readFileSync(this._file, {'encoding': 'UTF-8'});
	return this._process(text);
};

/**
 * @param {string} text
 * @returns {Array.<Section>}
 * @abstract
 * @protected
 */
Reader.prototype._process = function(text)
{
	throw new Error('must be implemented by subclass!');
};

module.exports = Reader;