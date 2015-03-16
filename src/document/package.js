var $arrays = require('../primitives/arrays.js');
var _ = require('lodash');

/**
 * @name Package
 *
 * Expects a package.json information to a consistent format. So that the
 * property values of this object can be used by other classes.
 *
 * @param {*} json
 * @constructor
 */
var Package = function(json)
{
	var self = this;
	this.data = {
		title:        json.name || undefined,
		description:  json.description || undefined,
		authors:      self.people(json.author),
		contributors: self.people(json.contributors),
		license:      self.license(json.license)
	};
};

/**
 * Converts a string description of a person into an object.
 *
 * Example:
 *
 * ```
 * "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
 * ```
 *
 * @param {string} str
 * @returns {{name:string,email:string,url:string}}
 */
Package.prototype.stringToPerson = function(str)
{
	// @todo: Parse string fields.
	return undefined;
};

/**
 * Converts person details into a consistent format.
 *
 * @param {*} json
 */
Package.prototype.people = function(json)
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
Package.prototype.license = function(json)
{
	json = $arrays.firstIfArray(json);
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

module.exports = Package;