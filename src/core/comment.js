var _ = require('lodash');

/**
 * Represents a comment in a source code file.
 *
 * @param {string} file
 * @param {Array.<exports.Line>} lines
 *
 * @constructor
 */
exports.Comment = function(file, lines)
{
	this._file = file;
	this._lines = lines;
};

/**
 * @returns {string}
 */
exports.Comment.prototype.getFile = function()
{
	return this._file;
};

/**
 * @param {exports.Line} line
 */
exports.Comment.prototype.append = function(line)
{
	this._lines.push(line);
};

/**
 * @returns {Array.<exports.Line>}
 */
exports.Comment.prototype.getLines = function()
{
	return this._lines;
};

/**
 * @param {Array.<exports.Line>} lines
 * @returns {exports.Comment}
 */
exports.Comment.prototype.setLines = function(lines)
{
	this._lines = lines;
	return this;
};

/**
 * Trims extra characters from lines of text that block out comments.
 *
 * @returns {Array.<exports.Line>}
 */
exports.trim = function(lines)
{
	if(lines.length === 0)
	{
		return [];
	}

	if(lines.length === 1)
	{
		var line = lines[0];

		// empty comment on one line /**** *****/
		if(/\/[\*\s]+\//.test(line.getText()))
		{
			return [];
		}

		// extract text from between comment indicators /** example **/
		var text = line.getText().replace(/^\/\*+/, "").replace(/\*+\/$/, "").trim();
		return [line.clone().setText(text)];
	}

	// assume the first and last lines are start/end markers for a block comment
	lines = _.dropRight(_.drop(lines));

	return _.map(lines, function(line)
	{
		line = line.clone().setText(line.getText().trim());
		if(_.startsWith(line.getText(), '*'))
		{
			line.setText(line.getText().substr(1).trim());
		}
		return line;
	});
};

/**
 * @param {string} file
 * @param {Array.<exports.Line>} lines
 *
 * @returns {Array.<exports.Comment>}
 */
exports.create = function(file, lines)
{
	var comments = [];
	var comment = null;
	_.each(lines, function(/** exports.Line */line)
	{
		if(line.getText().match(/^\/\*/) && !comment)
		{
			comment = [];
		}
		if(comment)
		{
			comment.push(line);
		}
		if(line.getText().match(/\*\/$/) && !!comment)
		{
			comments.push(new exports.Comment(file, exports.trim(comment)));
			comment = null;
		}
	}, this);
	return comments;
};