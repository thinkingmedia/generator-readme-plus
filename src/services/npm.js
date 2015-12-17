var _ = require('lodash');
var fs = require('fs');

var params = require('../params.js');
var arrays = require('../utils/arrays.js');
var reader = require('../files/reader.js');

exports.create = function(options)
{
	var plugin = function(options)
	{
		this.name = 'npm';
		this.valid = false;

		this.start = function()
		{
			this.json = reader.readJson(params.work + "package.json");
			this.valid = true;
			return true;
		};

		/**
		 * Updates the root section.
		 *
		 * @param {exports.Section} root
		 */
		this.write = function(root)
		{
			var json = exports.format(this.json);
			if(!json)
			{
				return;
			}
			if(!root.hasTitle() && json.title)
			{
				root.setTitle(json.title);
			}
			if(!root.hasContent() && json.description)
			{
				root.append(json.description);
			}
		};
	};

	return new plugin(options);
};

/**
 * Converts a string description of a person into an object.
 *
 * Example:
 *
 * ```
 * "Mathew Foscarini <support@thinkingmedia.ca> (http://www.thinkingmedia.ca/)"
 * ```
 *
 * @todo This is a file processor for the package.json type.
 *
 * @param {string} str
 * @returns {{name:string,email:string,url:string}}
 */
exports.stringToPerson = function(str)
{
	// @todo: Parse string fields.
	return undefined;
};

/**
 * Converts person details into a consistent format.
 *
 * @param {*} json
 */
exports.people = function(json)
{
	if(_.isUndefined(json))
	{
		return [];
	}
	if(!_.isArray(json))
	{
		return this.people([json]);
	}
	return _.compact(_.map(json, function(person)
	{
		if(_.isString(person))
		{
			return this.stringToPerson(person);
		}
		if(_.isObject(person))
		{
			return person;
		}
		return undefined;
	}, this));
};

/**
 * Gets the license of a project.
 *
 * @param {*} json
 */
exports.license = function(json)
{
	json = arrays.firstIfArray(json);
	if(_.isString(json))
	{
		return {'type': json};
	}
	if(_.isString(json.type))
	{
		return {
			'type': json.type,
			'url':  json.url || undefined
		};
	}
	return undefined;
};

/**
 * Formats the package.json into readable properties.
 *
 * @param {Object|undefined} json
 * @returns {Object|undefined}
 */
exports.format = function(json)
{
	if(!_.isObject(json))
	{
		return undefined;
	}
	return {
		title:        json.name || undefined,
		description:  json.description || undefined,
		authors:      exports.people(json.author),
		contributors: exports.people(json.contributors),
		license:      exports.license(json.license)
	};
};
