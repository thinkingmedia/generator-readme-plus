var _ = require('lodash');
var Q = require('q');
var logger = require('winston');

/**
 * The callback will be passed a item from the array and a promise. The returned promise is resolved when all the
 * callbacks have been resolved. This allows the callback to perform async operations that will resolve the promise
 * later.
 *
 * @param {Array} arr
 * @param {function(Object,Q.defer)} callback
 *
 * @returns {Q.promise}
 */
exports.each = function(arr, callback)
{
	var promises = _.map(arr, function(item)
	{
		var defer = Q.defer();
		try
		{
			callback(item, defer);
		}
		catch(ex)
		{
			logger.error(ex.message);
			logger.debug(ex.stack);
			defer.resolve(false);
		}
		return defer.promise;
	});

	var promise = Q.all(promises);

	// adds a short-cut to chaining each calls
	promise.each = function(callback)
	{
		promise.then(function()
					 {
						 exports.each(callback);
					 });
	};

	return promise;
};

/**
 * Executes the array of asynchronous callbacks in a synchronous order.
 *
 * @param {Array} arr
 * @param {function(Object,Q.defer)[]} callbacks
 */
exports.callThese = function(arr, callbacks)
{
	if(!_.isArray(callbacks) || callbacks.length === 0)
	{
		return;
	}
	exports.each(arr, _.first(callbacks))
		.then(function()
			  {
				  exports.callThese(arr, _.rest(callbacks));
			  });
};