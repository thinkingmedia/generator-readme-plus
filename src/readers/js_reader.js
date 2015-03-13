var $fs = require('fs');
var $section = require('../document/section.js');
var $util = require('util');

var $reader = require('./reader.js');

/**
 * @constructor
 * @extends Reader
 *
 * @readme Readers
 *
 * Readme will extract text from JavaScript source code files.
 *
 * @param {string} file
 */
var JsDocReader = function(file)
{
};
$util.inherits(JsDocReader,$reader);

/**
 * @see Reader._process
 */
JsDocReader.prototype._process = function(text)
{
};

module.exports = JsDocReader;