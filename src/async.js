var _ = require('lodash');
var Q = require('q');
var logger = require('winston');

/**
 * The callback will be passed a item from the array and a promise. The returned promise is resolved when all the
 * callbacks have been resolved. This allows the callback to perform async operations that will resolve the promise
 * later.
 *
 * @param {Array} arr
 * @param {function(Object):Q.promise} callback
 *
 * @returns {Q.promise}
 */
exports.each = function(arr, callback)
{
	var promises = _.compact(_.map(arr, function(item)
	{
		return callback(item);
	}));

	var all = Q.all(promises);
	all.catch(function(ex)
			  {
				  logger.error(ex.message);
				  logger.debug(ex.stack);
			  });
	return all;
};

/**
 * Executes the array of asynchronous callbacks in a synchronous order and resolves a deferred promise when finished.
 *
 * @param {Array} arr
 * @param {function(Object,Q.defer)[]} callbacks
 * @param {Q.defer} defer
 */
function callChain(arr, callbacks, defer)
{
	if(callbacks.length === 0)
	{
		defer.resolve();
		return;
	}
	exports.each(arr, _.first(callbacks))
		.then(function()
			  {
				  callChain(arr, _.rest(callbacks), defer);
			  })
		.catch(function(err)
			   {
				   logger.error(err);
			   });
}

/**
 * Executes the array of asynchronous callbacks in a synchronous order.
 *
 * @param {Array} arr
 * @param {function(Object,Q.defer)[]} callbacks
 * @returns {Q.promise}
 */
exports.callThese = function(arr, callbacks)
{
	var defer = Q.defer();
	callChain(arr, callbacks, defer);
	return defer.promise;
};