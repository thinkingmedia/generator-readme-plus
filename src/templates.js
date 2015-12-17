var Q = require('q');
var dust = require('dustjs-linkedin');
var reader = require('./files/reader.js');

/**
 * @param {string} name
 * @returns {string|undefined}
 */
exports.get = function(name)
{
	return reader.read(__dirname + "/template/" + name);
};

/**
 * @readme templates
 *
 * Readme+ uses templates to render text for common sections of the file. Things like
 * the authors, contributors and license.
 *
 * @param {string} name
 * @param {Object.<string,string>=} data
 * @returns {Q.Promise}
 */
exports.render = function(name, data)
{
	var defer = Q.defer();
	var template = exports.get(name);
	if(template)
	{
		dust.renderSource(template, data || {}, function(err, out)
		{
			defer.resolve(out);
		});
	} else
	{
		defer.reject('Template not found.');
	}
	return defer.promise;
};
