test('files/crawler', function($crawler)
{
	it('should check that the directory exists', function()
	{
		expect(function()
			   {
				   new $crawler.Task('/foo/bar/smack');
			   }).to.throwError('Directory does not exist');
	});

	it('should execute the callback for each file', function()
	{
		var crawler = new $crawler.Task(__data + 'files');
		var indx = 0;
		var files = [
			__data + 'files' + $path.sep + 'crawler' + $path.sep + 'empty',
			__data + 'files' + $path.sep + 'empty'
		];
		crawler.walk(function(file)
					 {
						 expect(indx).to.lessThan(2);
						 expect(file).to.equal(files[indx++]);
					 });
	});
});