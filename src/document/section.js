/**
 * Defines a section in the document.
 *
 * @param {string} id
 * @param {exports.Section} parent
 */
exports.Section = function(id, parent)
{

	/**
	 * ID of this section. The ID is unique only for the parent section.
	 *
	 * @type {string|null}
	 */
	this.id = id;

	/**
	 * The parent that owns this section.
	 *
	 * @type {exports.Section}
	 */
	this.parent = parent;

	/**
	 * The title of the section.
	 *
	 * @type {string|null}
	 */
	this.title = null;

	/**
	 * URL associated with the title.
	 *
	 * @type {string|null}
	 */
	this.url = null;

	/**
	 * Different widget locations.
	 */
	this.widgets = {
		title:  [],
		top:    [],
		bottom: []
	};

	/**
	 * The contents of this section.
	 *
	 * @type {Array.<string>}
	 */
	this.content = [];

	/**
	 * The child sections.
	 *
	 * @type {Object.<string,exports.Section>}
	 */
	this.children = {};

	/**
	 * Returns the child for the current node. If the child does not exist a new child is created for that ID.
	 *
	 * @param id
	 */
	this.child = function(id)
	{
		if(!this.children.hasOwnProperty(id))
		{
			this.children[id] = exports.create(id, this);
			this.children[id].parent = this;
		}
		return this.children[id];
	};

	/**
	 * Appends text to the contents.
	 *
	 * @param {string[]} lines
	 */
	this.append = function(lines)
	{
		this.content = this.content.concat(lines);
	};
};

/**
 * Factory method.
 *
 * @param {string} id
 * @param {exports.Section} parent
 *
 * @returns {exports.Section}
 */
exports.create = function(id, parent)
{
	return new exports.Section(id, parent);
};

/**
 * Converts a path to an array of section IDs
 *
 * @todo Need to validate a path as a correct format.
 *
 * @param {string} str
 * @returns {string[]}
 */
exports.path = function(str)
{
	return str.trim()
		.toLowerCase().
		replace(/\s+/g, ' ') // remove extra spaces
		.path(/\\\//g, '.') // convert \ / chars to dots
		.replace(/\.+/g, '.') // remove extra dots
		.split('.');
};

/**
 * Finds a section give a path. If the section does not exist it will be created.
 *
 * @param {string|string[]} path
 * @returns {exports.Section}
 */
exports.find = function(path)
{
	if(_.isString(path))
	{
		return exports.find(exports.path(path));
	}

	var cursor = exports.root;
	_.each(path, function(id)
	{
		cursor = cursor.get(id);
	});

	return cursor;
};

/**
 * The top most section
 *
 * @type {exports.Section}
 */
exports.root = exports.create('root', null);
