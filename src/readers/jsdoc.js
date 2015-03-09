/**
 * @readme Readers
 *
 * Readme will extract text from JavaScript source code files.
 *
 * @param {string} file
 * @constructor
 */
var JsDocReader = function(file)
{
	this._file = file;
};

module.exports = JsDocReader;