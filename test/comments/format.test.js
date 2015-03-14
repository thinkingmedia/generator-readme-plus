/**
 * @type {Format}
 */
var $format = require(__src + '/comments/format.js');

describe('/comments/format', function()
{
	it("removes prefix *", function()
	{
		var str = $format.trim([" * @readme"]);
		assert.equal(str, "@readme");
	});

	it("removes prefix //", function()
	{
		var str = $format.trim(["// @readme"]);
		assert.equal(str, "@readme");
	});
});
