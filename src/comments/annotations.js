var _ = require('lodash');
var util = require('util');

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
 * @param {string} text
 * @returns {string|null}
 */
exports.getName = function(text)
{
	var parts = text.toUpperCase().trim().split(' ');
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
 * @param {string} text
 * @returns {string|null}
 */
exports.getTitle = function(text)
{
	var parts = text.trim().split(' ');
	return _.drop(parts,2).join(' ') || _.first(_.rest(parts)) || null;
};

/**
 * Extracts the lines between `@readme` and next annotation or end of comment.
 * Lines should be trimmed of comment characters.
 *
 * @see Format.trim
 * @param {Array.<string>} lines
 * @returns {Array.<string>|undefined}
 */
exports.getReadme = function(lines)
{
	if(!util.isArray(lines))
	{
		throw new Error('Expected an array.');
	}

	// drop lines until we find a @readme
	lines = _.dropWhile(lines, function(line)
	{
		return !_.startsWith(line, '@readme');
	});

	if(lines.length === 0)
	{
		return undefined;
	}

	return {
		name:  exports.getName(_.first(lines)),
		title: exports.getTitle(_.first(lines)),
		// take remaining lines until end or another property
		lines: _.takeWhile(_.rest(lines), function(line)
		{
			return !_.startsWith(line, '@');
		})
	};
};