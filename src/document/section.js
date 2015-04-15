var _ = require('lodash');
var logger = require('winston');
var sprintf = sprintf = require("sprintf-js").sprintf;

var lines = require('../core/line.js');

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
	 * Changes the title
	 *
	 * @param {string|undefined|null} str
	 */
	this.setTitle = function(str)
	{
		this.title = this.title || str || null;
	};

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
		trace:  [],
		top:    [],
		bottom: []
	};

	/**
	 * The contents of this section.
	 *
	 * @type {Array.<exports.Line>}
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
	 * @returns {exports.Section}
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
	 * @param {Array.<exports.Line>|Array.<string>|string,exports.Line} strings
	 */
	this.append = function(strings)
	{
		if(_.isString(strings))
		{
			return this.append(lines.create(strings));
		}
		strings = _.map(strings, function(str)
		{
			return _.isString(str)
				? lines.create(str)
				: str;
		});
		this.content = this.content.concat(strings);
	};

	/**
	 * Gets the content for this section.
	 * @returns {Array.<exports.Line>}
	 */
	this.getContent = function()
	{
		return _.compact(this.content);
	};

	/**
	 * The depth of this node in the tree.
	 *
	 * @returns {int}
	 */
	this.depth = function()
	{
		return this.parent
			? this.parent.depth() + 1
			: 1;
	};

	/**
	 * Renders this section and children.
	 *
	 * @param {string[]=} lines
	 * @returns {string[]}
	 */
	this.render = function(lines)
	{
		lines = lines || [];

		var title = [
			_.repeat('#', this.depth()),
			this.widgets.trace.join(' ') + this.title,
			this.widgets.title.join(' ')
		];

		lines.push(_.compact(title).join(' '));
		lines.push(this.widgets.top.join(' '));

		lines = lines.concat(_.map(_.compact(this.content), function(/** exports.Line */line)
		{
			return line.getText();
		}));

		lines.push(this.widgets.bottom.join(' '));

		_.each(this.children, function(child)
		{
			lines = child.render(lines);
		});

		return lines;
	};

	/**
	 * Adds a badge to a widget location.
	 *
	 * @param {string} widget
	 * @param {string} title
	 * @param {string} img
	 * @param {string} url
	 */
	this.addBadge = function(widget, title, img, url)
	{
		if(_.isArray(this.widgets[widget]))
		{
			var str = exports.badge(title, img, url);
			this.widgets[widget].push(str);
		}
	};

	/**
	 * Adds a link to a widget location.
	 *
	 * @param {string} widget
	 * @param {string} title
	 * @param {string} url
	 * @param {boolean=} tiny
	 */
	this.addLink = function(widget, title, url, tiny)
	{
		if(_.isArray(this.widgets[widget]))
		{
			var format = tiny ? "<sub><sup>[%s](%s)</sub></sup>" : "[%s](%s)";
			this.widgets[widget].push(sprintf(format, title, url));
		}
	};
};

/**
 * Finds a section by it's ID.
 *
 * @param {string} id
 */
exports.find = function(id)
{
	if(!!id || id.trim().toUpperCase() === 'ROOT')
	{
		return exports.root;
	}
	return exports.root.child(id);
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
exports.root = exports.create('ROOT', null);

/**
 * Creates a badge image in markdown.
 *
 * @param {string} title
 * @param {string} img
 * @param {string} url
 * @returns {string}
 */
exports.badge = function(title, img, url)
{
	return _.template("[![${title}](${img})](${url})")({title: title, img: img, url: url});
};
