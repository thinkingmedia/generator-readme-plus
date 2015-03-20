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
	// @todo should usage if --help or /? are set
	if(!$optJs.opt.work)
	{
		console.error('Usage: readme --work=<path_to_work_folder>');
		return undefined;
	}
	// force linux path
	// @todo this should be done for all paths
	var path = $optJs.opt.work.replace(/\\/g, '/');
	// @todo collect paths into an array and then do this check
	if(!$fs.existsSync(path))
	{
		console.error('Directory: ' + path);
		console.error('Does not exist.');
		return undefined;
	}
	// @todo this should be a logger
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
	// @todo is /src doesn't exist they must use a parameter (readme should fail)
	return $fs.existsSync($path.join(work, '/src')) ? $path.join(work, '/src') : work;
}

/**
 *
 */
exports.run = function()
{
	// @todo both work and source should be parameters
	var work = getWorkDirectory();
	if(!work)
	{
		return;
	}
	var source = getSourceDirectory(work);

	// @todo use a logger module
	console.log('Source: ' + source);

	// @todo document shouldn't care about paths
	// @todo document should just hold sections
	var doc = new $document.Doc(work, source);

	// @todo process as a verb isn't very clear
	// @todo change to a plugin loader
	// @todo load the plugins (file finders, and file processors)
	$process.process(doc);

	// @todo readme location can be optional option
	// @todo in debug mode just output readme to the console.
	// @todo rendering logic can be done in this module
	$process.render(doc, $path.join(work, "/README.md"));
};
