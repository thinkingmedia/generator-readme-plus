var fs = require('fs');
var path = require('path');
var args = require('optjs')();
var _ = require('lodash');
var logger = require('winston');

/**
 * @type {boolean}
 */
exports.silent = args.opt.s || args.opt.silent;

/**
 * @type {boolean}
 */
exports.version = false;

/**
 * @type {string|null}
 */
exports.work = args.argv[0] || null;

/**
 * @type {string|null}
 */
exports.source = null;

if(_.isString(exports.work))
{
	exports.work = path.normalize(exports.work.replace(/\\/g, '/')) + path.sep;
	exports.source = path.normalize(exports.work) + (args.opt.source || 'src');
	exports.source = path.normalize(exports.source.replace(/\\/g, '/')) + path.sep;

	exports.work = exports.work.replace(/\\/g,'/');
	exports.source = exports.source.replace(/\\/g,'/');
}

/**
 * @type {boolean}
 */
exports.debug = !!args.opt.debug;
if(exports.debug)
{
	logger.level = 'debug';
}

/**
 * Reads the version number from VERSION.txt
 * @returns {string}
 */
exports.getVersion = function()
{
	return _(fs.readFileSync("VERSION.txt", 'utf8').trim().split("\n")).last();
};

/**
 * Shows the version number.
 */
exports.showVersion = function()
{
	exports.log(exports.getVersion());
};

/**
 * Checks if the parameters are valid
 *
 * @todo this can be part of the module startup
 */
exports.invalid = function()
{
	if(!exports.work)
	{
		return true;
	}

	if(!fs.existsSync(exports.work))
	{
		console.error('Not found: ' + exports.work);
		return true;
	}

	if(!fs.existsSync(exports.source))
	{
		console.error('Source not found: ' + exports.source);
		return true;
	}

	return false;
};

/**
 * Displays the copyright message.
 */
exports.copyright = function()
{
	var version = exports.getVersion();

	console.log('Readme version \"' + version + '\"');
	console.log('Copyright (c) 2015. ThinkingMedia. http://www.thinkingmedia.ca');
	console.log('Developed by Mathew Foscarini, support@thinkingmedia.ca');
	console.log('This is free software; see the source for MIT license.');
	console.log('');
};

/**
 * Displays the program usage.
 */
exports.usage = function()
{
	console.log('Usage: readme [options] <path>');
	console.log('');
	console.log('Example: readme --source=./www/js /home/travis/user/repo');
	console.log('');
	console.log('Options:');
	console.log('  -v, --version    print version number');
	console.log('  -s, --silent     hides copyright message');
	console.log('  -d, --debug      send README.md output to console');
	console.log('  --verbose        show debug message');
	console.log('  --source         path to source folder (default: ./src)');
	console.log('  --file           name of output file (default: README.md)');
};