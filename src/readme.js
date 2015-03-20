var $path = require('path');
var $fs = require('fs');
var $optJs = require("optjs")();

var $document = require('./document/document.js');
var $process = require('./process.js');

/**
 * Gets the target folder from the command line.
 *
 * @returns {string|undefined}
 * @private
 */
function getWorkDirectory()
{
	if(!$optJs.opt.work)
	{
		console.error('Usage: readme --work=<path_to_work_folder>');
		return undefined;
	}
	// force linux path
	var path = $optJs.opt.work.replace(/\\/g, '/');
	if(!$fs.existsSync(path))
	{
		console.error('Directory: ' + path);
		console.error('Does not exist.');
		return undefined;
	}
	console.log('Work: ' + path);
	return path;
}

/**
 * Gets the source code folder.
 *
 * @param {string} work
 * @private
 */
function getSourceDirectory(work)
{
	return $fs.existsSync($path.join(work, '/src')) ? $path.join(work, '/src') : work;
}

/**
 *
 */
exports.run = function()
{
	var work = getWorkDirectory();
	if(!work)
	{
		return;
	}
	var source = getSourceDirectory(work);
	console.log('Source: ' + source);

	var doc = new $document.Doc(work, source);

	$process.process(doc);
	$process.render(doc, $path.join(work, "/README.md"));
};
