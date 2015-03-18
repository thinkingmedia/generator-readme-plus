var $path = require('path');
var $fs = require('fs');
var _ = require('lodash');
var $optJs = require("optjs")();

/**
 * @name appRequire
 * @param {string} name
 * @returns {*}
 */
global.appRequire = function(name)
{
	return require(__dirname + $path.sep + name);
};

var $document = appRequire('document/document.js');
var $process = appRequire('process.js');


/**
 * Gets the target folder from the command line.
 *
 * @returns {string|undefined}
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
 */
function getSourceDirectory(work)
{
	return $fs.existsSync($path.join(work, '/src'))
		? $path.join(work, '/src')
		: work;
}

var work = getWorkDirectory();
if(!work)
{
	return;
}
var source = getSourceDirectory(work);
console.log('Source: ' + source);

/**
 * @type {ReadmeDocument}
 */
var doc = new $document(work, source);

$process.process(doc);
$process.render(doc,$path.join(work,"/README.md"));