var $fs = require('fs');
var $search = require(__src + "comments/search.js");

/**
 * @type {Format}
 */
var $format = require(__src + '/comments/format.js');

describe('comments', function()
{
	describe('format',function()
	{
		it("these should yield an empty array", function()
		{
			assert.deepEqual($format.trim([]),[]);
			assert.deepEqual($format.trim(["//"]),[]);
			assert.deepEqual($format.trim(["//","//"]),[]);
			assert.deepEqual($format.trim(["/********/"]),[]);
			assert.deepEqual($format.trim(["/****  ****/"]),[]);
			assert.deepEqual($format.trim(["/**","*/"]),[]);
		});

		it("these should yield a single line", function()
		{
			// C++ style comment
			var arr = $format.trim(["/**"," * @readme","*/"]);
			assert.deepEqual(arr, ["@readme"]);

			// end of line comments
			arr = $format.trim(["//","// @readme","//"]);
			assert.deepEqual(arr, ["@readme"]);

			// C style comment
			arr = $format.trim(["/*"," * @readme","*/"]);
			assert.deepEqual(arr, ["@readme"]);

			// single line comment
			arr = $format.trim(["/** @readme */"]);
			assert.deepEqual(arr, ["@readme"]);
		});

		it("removes all comment markers", function()
		{
			var text = $fs.readFileSync(__data + "readme_1.txt", {'encoding': 'UTF-8'});
			var comments = $search.findComments(text);
			assert.equal(comments.length, 1);

			var arr = $format.trim(comments[0]);
			assert.deepEqual(arr, ['@readme', '', 'A simple message to be extracted for the readme file.'])
		});
	});
});
