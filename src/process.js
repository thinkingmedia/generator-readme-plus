var $fs = require('fs');
var _ = require('lodash');
var $dust = require('dustjs-linkedin');
var $crawler = require('./files/crawler.js');
var $reader = require('./comments/reader.js');

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

module.exports = {
	/**
	 * @param {ReadmeDocument} doc
	 */
	process: function(doc)
	{
		var crawl = new $crawler(doc.src);
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
	},
	/**
	 * @param {ReadmeDocument} doc
	 * @param {string} readme
	 */
	render: function(doc,readme)
	{
		$dust.renderSource($fs.readFileSync("./template/README.dust", "utf8"), doc, function(err, out)
		{
			$fs.writeFileSync(readme, out.trim(), {'encoding': 'UTF-8'});

			console.log('');
			console.log('done.');
		});
	}
};



console.log('');


