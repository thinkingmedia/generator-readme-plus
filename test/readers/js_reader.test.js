var $fs = require('fs');

/**
 * @type {JsDocReader}
 */
var $reader = require(__src + '/readers/js_reader.js');

describe('/readers/js_reader', function()
{
	it('contains no sections', function()
	{
		var reader = new $reader(__data + "long_comment.txt");
		var sections = reader.getSections();
		assert.equal(sections.length,0);
	});

	it('contains 1 small section', function()
	{
		var reader = new $reader(__data + "readme_1.txt");
		var sections = reader.getSections();
		assert.equal(sections.length,1);
		assert.equal(sections[0].name,"@readme");
		assert.deepEqual(sections[0].lines,['','A simple message to be extracted for the readme file.']);
	});

	it('contains multiple sections', function()
	{
		var reader = new $reader(__data + "readme_4.txt");
		var sections = reader.getSections();
		assert.equal(sections.length,3);
	});
});