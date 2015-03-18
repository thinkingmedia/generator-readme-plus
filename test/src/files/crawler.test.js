var $path = require('path');

/**
 * @type {Crawler}
 */
var $crawler = require(__src + 'files/crawler.js');

describe('/files/crawler', function()
{
	it('should check that the directory exists', function()
	{
		expect(function()
			   {
				   new $crawler('/foo/bar/smack');
			   }).to.throwError('Directory does not exist');
	});

	it('should execute the callback for each file', function()
	{
		var crawler = new $crawler(__data + 'files');
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