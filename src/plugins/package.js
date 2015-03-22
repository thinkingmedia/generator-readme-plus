var _ = require('lodash');

var arrays = require('../primitives/arrays.js');
var reader = require('../files/reader.js');

exports.create = function(options)
{
	var plugin = function(options)
	{
		this.name = 'package';
		this.valid = false;

		this.start = function()
		{
			this.valid = true;
			return true;
		};

		this.read = function(file)
		{
			var json = reader.readJson(file);
			return;
			if(json)
			{
				var data = exports.format(json);
				this.title = data.title || this.title;
				this.desc = data.description || this.desc;
				this.authors = data.authors;
				this.license = data.license || this.license;
			}
		}
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

exports.format = function(json)
{
	var self = this;
	return {
		title:        json.name || undefined,
		description:  json.description || undefined,
		authors:      self.people(json.author),
		contributors: self.people(json.contributors),
		license:      self.license(json.license)
	};
};
