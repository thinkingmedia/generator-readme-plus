var _ = require('lodash');

/**
 *
 * @param {string|undefined} value
 * @param {*} _default
 */
exports.get = function(value, _default)
{
	if(_.isString(value) && value.trim() === '')
	{
		return _default;
	}
	return !!value ? value : _default;
};
