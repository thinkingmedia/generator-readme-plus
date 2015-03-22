test('plugins/reader', function(reader)
{
	beforeEach(function()
			   {
				   this.reader = reader.create({});
				   this.reader.start();
			   });

	it('contains no sections', function()
	{
		var comments = this.reader.getSections(__data + "long_comment.txt");
		assert.equal(comments.length,0);
	});

	it('contains 1 small section', function()
	{
		var comments = this.reader.getSections(__data + "readme_1.txt");
		assert.equal(comments.length,1);
		//assert.equal(comments[0].name,"House");
		//assert.deepEqual(comments[0].getLines(),['A simple message to be extracted for the readme file.']);
	});

	it('contains multiple sections', function()
	{
		var comments = this.reader.getSections(__data + "readme_4.txt");
		assert.equal(comments.length,3);
	});
});