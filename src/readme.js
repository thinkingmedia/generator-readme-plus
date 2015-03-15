var $path = require('path');
var $fs = require('fs');
var _ = require('lodash');

/**
 * @type {Readers}
 */
var $readers = require('./readers/package.js');

/**
 * @type {Document}
 */
var doc = require('./document/document.js');

// @todo configure were to look for source code.
$readers.crawl_files(process.cwd() + $path.sep + "src", function(file, reader)
{
	_.each(reader.getSections(),function(/** Section */section)
	{
		var doc_section = doc.getSection(section.name);
		doc_section.append(section);
	});
});

$fs.writeFileSync("README.md", doc.toString());

