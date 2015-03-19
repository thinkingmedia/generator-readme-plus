var $fs = require('fs');
var _ = require('lodash');
var $dust = require('dustjs-linkedin');

var $crawler = require('./files/crawler.js');
var $reader = require('./comments/reader.js');

/**
 * @param {exports.Doc} doc
 */
exports.process = function(doc)
{
	var crawl = new $crawler.Task(doc.src);
	crawl.walk(function(file)
			   {
				   if(_.endsWith(file, ".js"))
				   {
					   var reader = new $reader.File(file);
					   _.each(reader.getSections(), function(/** exports.Detail */section)
					   {
						   var doc_section = doc.getSection(section.name);
						   doc_section.append(section);
					   });
				   }
			   });
};

/**
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
