test('plugins/reader', function(reader)
{
	beforeEach(function()
			   {
				   this.reader = reader.create({});
				   this.reader.start();
			   });

	it('contains no sections', function()
	{
		// @todo this is a SourceCode test
		//var comments = this.reader.read(__data + "long_comment.txt");
		//assert.equal(comments.length,0);
	});

	it('contains 1 small section', function()
	{
		// @todo this is a SourceCode test
		//var comments = this.reader.read(__data + "readme_1.txt");
		//assert.equal(comments.length,1);
	});

	it('contains multiple sections', function()
	{
		// @todo this is a SourceCode test
		//var comments = this.reader.read(__data + "readme_4.txt");
		//assert.equal(comments.length,3);
	});
});