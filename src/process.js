var $fs = require('fs');
var _ = require('lodash');
var $dust = require('dustjs-linkedin');

var $crawler = require('./files/crawler.js');
var $reader = require('./comments/reader.js');

/**
 * @todo this will only generate sections from comments. We need things like install, contributors, license, etc.
 * @todo extracting sections from comments should be done as one of the possible plugins.
 * @todo this isn't a processor, it's a plugin loader and runner.
 * @todo one type of plugin handles finding files, and the other is a processor of files (by type or name/location).
 *
 * @param {exports.Doc} doc
 */
exports.process = function(doc)
{
	var crawl = new $crawler.Task(doc.src);
	crawl.walk(function(file)
			   {
				   // @todo more than just js files
				   if(_.endsWith(file, ".js"))
				   {
					   var reader = new $reader.File(file);
					   _.each(reader.getSections(), function(/** exports.Detail */section)
					   {
						   // @todo this part isn't clear.
						   var doc_section = doc.getSection(section.name);
						   doc_section.append(section);
					   });
				   }
			   });
};

/**
 * @todo Rendering should be part of this module.
 *
 * @param {exports.Doc} doc
 * @param {string} readme
 */
exports.render = function(doc, readme)
{
	$dust.renderSource($fs.readFileSync("./template/README.dust", "utf8"), doc, function(err, out)
	{
		$fs.writeFileSync(readme, out.trim(), {'encoding': 'UTF-8'});

		console.log('');
		console.log('done.');
	});
};
