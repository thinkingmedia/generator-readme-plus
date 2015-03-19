test('comments/reader', function($reader)
{
	it('contains no sections', function()
	{
		var reader = new $reader.File(__data + "long_comment.txt");
		var sections = reader.getSections();
		assert.equal(sections.length,0);
	});

	it('contains 1 small section', function()
	{
		var reader = new $reader.File(__data + "readme_1.txt");
		var sections = reader.getSections();
		assert.equal(sections.length,1);
		assert.equal(sections[0].name,"House");
		assert.deepEqual(sections[0].getLines(),['A simple message to be extracted for the readme file.']);
	});

	it('contains multiple sections', function()
	{
		var reader = new $reader.File(__data + "readme_4.txt");
		var sections = reader.getSections();
		assert.equal(sections.length,3);
	});
});