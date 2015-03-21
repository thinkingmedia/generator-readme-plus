/**
 * Defines a section in the document.
 */
exports.Section = {

	/**
	 * ID of this section
	 *
	 * @type {string|null}
	 */
	id: null,

	/**
	 * The title of the section.
	 *
	 * @type {string|null}
	 */
	title: null,

	/**
	 * URL associated with the title.
	 *
	 * @type {string|null}
	 */
	url: null,

	/**
	 * Different widget locations.
	 */
	widgets: {
		title:  [],
		top:    [],
		bottom: []
	},

	/**
	 * The contents of this section.
	 *
	 * @type {Array.<string>}
	 */
	content: [],

	/**
	 * The child sections.
	 *
	 * @type {Array}
	 */
	children: []
};

/**
 * Factory method.
 *
 * @param {string} id
 *
 * @returns {exports.Section}
 */
exports.create = function(id)
{
	var section = new exports.Section;
	section.id = id;
	return section;
};

/**
 * The top most section
 *
 * @type {exports.Section}
 */
exports.root = exports.create('root');
