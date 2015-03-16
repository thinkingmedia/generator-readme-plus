var _ = require('lodash');

/**
 * @name Strings
 */
var Strings = {
	/**
	 *
	 * @param {string|undefined} value
	 * @param {*} _default
	 */
	get: function(value, _default)
	{
		if(_.isString(value) && value.trim() == '')
		{
			return _default;
		}
		return !!value ? value : _default;
	}
};

module.exports = Strings;