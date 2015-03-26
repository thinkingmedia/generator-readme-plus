var _ = require('lodash');

/**
 * @param {string} file
 * @param {string} name
 * @param {string} title
 * @param {Array.<exports.Line>} lines
 * @constructor
 */
exports.Tag = function(file, name, title, lines)
{
	this._file = file;
	this._name = name;
	this._title = title;
	this._lines = lines;
};

/**
 * @returns {string}
 */
exports.Tag.prototype.getFile = function()
{
	return this._file;
};

/**
 * @returns {string}
 */
exports.Tag.prototype.getName = function()
{
	return this._name;
};

/**
 * @returns {string}
 */
exports.Tag.prototype.getTitle = function()
{
	return this._title;
};

/**
 * @returns {Array.<exports.Line>}
 */
exports.Tag.prototype.getLines = function()
{
	return this._lines;
};

/**
 * @readme Sections.Names Naming The Sections
 *
 * Each heading in a readme file is defined by a section of source code comments that use the `@readme` indicator. The
 * first word after the `@readme` indicator is the name and default title of the section.
 *
 * ```
 * /**
 *  * \@readme Install
 *  *
 *  *  Use `npm` to install the `foobar` module.
 *  *
 *  *  ```shell
 *  *  $ npm install foobar
 *  *  ```
 *  *\/
 * ```
 *
 * In the above example a heading labelled `Installations` will be added under the root section with the markdown text
 * found in the comment.
 *
 * @param {exports.Line} text
 * @returns {string|null}
 */
exports.getName = function(text)
{
	var parts = text.getText().replace(/\s+/g, ' ').toUpperCase().split(' ');
	if(_.first(parts) != '@README')
	{
		return null;
	}
	return _.first(_.rest(parts)) || null;
};

/**
 * @readme Sections.Titles Changing The Section Title
 *
 * You can customize the heading used for each section by providing title text after declaring the section.
 *
 * ```
 * /**
 *  * \@readme Install Installation Instructions
 *  *
 *  *  Use `npm` to install the `foobar` module.
 *  *
 *  *  ```shell
 *  *  $ npm install foobar
 *  *  ```
 *  *\/
 * ```
 * In the above example the default heading `Install` is replaced with `Installation Instructions`.
 *
 * @param {exports.Line} text
 * @returns {string|null}
 */
exports.getTitle = function(text)
{
	var parts = text.getText().replace(/\s+/g, ' ').trim().split(' ');
	var title = _.drop(parts, 2).join(' ') || _.first(_.rest(parts)) || null;
	var quotes = ((_.startsWith(title, '"') && _.endsWith(title, '"'))
				  || (_.startsWith(title, '\'') && _.endsWith(title, '\'')));
	return quotes
		? title.slice(1, -1)
		: title;
};

/**
 * Extracts the lines between `@readme` and next annotation or end of comment.
 * Lines should be trimmed of comment characters.
 *
 * @param {exports.Comment} comment
 * @param {string} tag
 *
 * @returns {Array.<exports.Tag>}
 */
exports.create = function(comment, tag)
{
	/** @var {Array.<exports.Line>} */
	var lines = _.dropWhile(comment.getLines(), function(/** exports.Line **/line)
	{
		return !_.startsWith(line.getText().toLowerCase(), '@' + tag);
	});

	if(lines.length === 0)
	{
		return [];
	}

	/** @var {Array.<exports.Line>} */
	var body = _.takeWhile(_.rest(lines), function(/** exports.Line **/line)
	{
		return !_.startsWith(line.getText(), '@');
	});

	var name = exports.getName(_.first(lines));
	var title = exports.getTitle(_.first(lines));

	return [new exports.Tag(comment.getFile(), name, title, body)];
};