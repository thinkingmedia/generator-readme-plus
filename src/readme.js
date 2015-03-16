var $path = require('path');
var $fs = require('fs');
var _ = require('lodash');

/**
 * @type {dust}
 */
var $dust = require('dustjs-linkedin');

/**
 * @type {Crawler}
 */
var $crawler = require('./files/crawler.js');

/**
 * @type {Reader}
 */
var $reader = require('./comments/reader.js');

/**
 * @type {Document}
 */
var doc = require('./document/document.js');

var source = $fs.existsSync(process.cwd() + $path.sep + "src")
	? process.cwd() + $path.sep + "src"
	: process.cwd();

var crawl = new $crawler(source);
crawl.walk(function(file)
		   {
			   if(_.endsWith(file, ".js"))
			   {
				   var reader = new $reader(file);
				   _.each(reader.getSections(), function(/** Section */section)
				   {
					   var doc_section = doc.getSection(section.name);
					   doc_section.append(section);
				   });
			   }
		   });

var template = $fs.readFileSync('template/README.dust', {'encoding': 'UTF-8'});
//template = template.replace(/\n/g, "{~n}");

$dust.renderSource(template, doc, function(err, out)
{
	$fs.writeFileSync("README.md", out, {'encoding': 'UTF-8'});
});

