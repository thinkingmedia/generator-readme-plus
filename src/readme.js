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

$dust.debugLevel = 'DEBUG';

$dust.onLoad = function(name, callback)
{
	var path = "./template/" + name + ".dust";
	if($fs.existsSync(path))
	{
		callback(undefined, $fs.readFileSync(path, 'utf8'));
		return;
	}
	callback(new Error("Template not found: " + path), undefined);
};

$dust.renderSource($fs.readFileSync("./template/README.dust", "utf8"), doc, function(err, out)
{
	$fs.writeFileSync("README.md", out, {'encoding': 'UTF-8'});
});

