var $path = require('path');
var $fs = require('fs');
var _ = require('lodash');

/**
 * @type {Readers}
 */
var $readers = require('./readers/package.js');

/**
 * @type {Array.<Section>}
 */
var sections = [];

// @todo configure were to look for source code.
$readers.crawl_files(process.cwd() + $path.sep + "src", function(file, reader)
{
	_.each(reader.getSections(),function(section)
	{
		sections.push(section);
	});
});


var text = '';

_.each(sections,function(/** Section */section)
{
	text += "#"+section.name+"\n";
	text += "\n";
	text += section.lines.join("\n");
	text += "\n";
});

$fs.writeFileSync("README.md", text);

