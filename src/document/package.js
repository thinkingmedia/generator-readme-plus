var $arrays = require('../primitives/arrays.js');
var _ = require('lodash');

module.exports = {
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
	stringToPerson: function(str)
	{
		// @todo: Parse string fields.
		return undefined;
	},
	/**
	 * Converts person details into a consistent format.
	 *
	 * @param {*} json
	 */
	people:         function(json)
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
	}
	,
	/**
	 * Gets the license of a project.
	 *
	 * @param {*} json
	 */
	license:        function(json)
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
	}
	,
	format:         function(json)
	{
		var self = this;
		return {
			title:        json.name || undefined,
			description:  json.description || undefined,
			authors:      self.people(json.author),
			contributors: self.people(json.contributors),
			license:      self.license(json.license)
		};
	}
}
;