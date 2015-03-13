var $path = require('path');

/**
 * @type {Readers}
 */
var $readers = require('./readers/package.js');
$readers.crawl_files(process.cwd() + $path.sep + "src", function(file, reader)
{
	console.log(reader.getSections());
	console.log(file);
});
