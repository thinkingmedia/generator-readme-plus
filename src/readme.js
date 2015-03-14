var $path = require('path');

/**
 * @type {Readers}
 */
var $readers = require('./readers/package.js');
$readers.crawl_files(process.cwd() + $path.sep + "src", function(file, reader)
{
	var sections = reader.getSections();
	console.log(sections);
	//console.log(file);
});
