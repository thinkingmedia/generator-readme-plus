var fs = require('fs');
var path = require('path');
var args = require('optjs')();
var _ = require('lodash');
var logger = require('winston');

/**
 * @type {boolean}
 */
exports.silent = !!args.opt.s || !!args.opt.silent;

/**
 * @type {boolean}
 */
exports.verbose = !!args.opt.verbose;

/**
 * @type {boolean}
 */
exports.version = !!args.opt.v || !!args.opt.version;

/**
 * @type {boolean}
 */
exports.help = !!args.opt.h || !!args.opt.help;

/**
 * @type {string|null}
 */
exports.work = args.argv[0] || process.cwd();

/**
 * @type {string|null}
 */
exports.source = null;

/**
 * @type {boolean}
 */
exports.trace = !!args.opt.t || !!args.opt.trace;

/**
 * The name of the readme file to write.
 *
 * @type {string}
 */
exports._file = args.opt._file || 'README.md';

/**
 * Configure the paths
 */
(function()
{
	exports.work = path.normalize(exports.work.replace(/\\/g, '/')) + path.sep;
	exports.source = path.normalize(exports.work) + (args.opt.source || 'src');
	exports.source = path.normalize(exports.source.replace(/\\/g, '/')) + path.sep;

	exports.work = exports.work.replace(/\\/g, '/');
	exports.source = exports.source.replace(/\\/g, '/');
})();

/**
 * @type {boolean}
 */
exports.debug = !!args.opt.d || !!args.opt.debug;
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
	return _(fs.readFileSync(__dirname + "/../VERSION.txt", 'utf8').trim().split("\n")).last();
};

/**
 * Shows the version number.
 */
exports.showVersion = function()
{
	console.log(exports.getVersion());
};

/**
 * Checks if the parameters are valid
 */
exports.validate = function()
{
	if(exports.work === null && !fs.existsSync(".git"))
	{
		throw new Error("Current directory does not appear to be Git working folder.");
	}

	//exports.work = exports.work || process.cwd();
	if(!fs.existsSync(exports.work))
	{
		throw new Error("Working folder not found: " + exports.work);
	}

	//exports.source = exports.work || exports.source + "/src";
	if(!fs.existsSync(exports.source))
	{
		throw new Error("Source code folder not found: " + exports.source);
	}
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
 * Displays the current configured options.
 */
exports.showConfig = function()
{
	var config = {
		'Work':   exports.work,
		'Source': exports.source,
		'Trace':  exports.trace,
		'Debug':  exports.debug,
		'Output': exports._file
	};
	var size = 0;
	_.each(config, function(value, key)
	{
		size = Math.max(size, key.length + 1);
	});
	_.each(config, function(value, key)
	{
		console.log(_.padLeft(key, size) + ": " + value);
	});
	console.log('');
};

/**
 * Displays the program usage.
 *
 * @readme Usage
 *
 * Run `readme` on the command line in the working folder where you want to generate a README.md file.
 *
 * ```shell
 * $ cd /home/user/work
 * $ readme
 * ```
 *
 * The default options assume your working folder contains a sub-folder named `src` that contains
 * the source code for your project.
 *
 * ```
 * Usage: readme [options] <path>
 *
 * Example: readme --source=./www/js /home/mathew/thinkingmedia/readme
 *
 * Options:
 *   -h, --help       shows this usage message
 *   -v, --version    print version number
 *   -s, --silent     hides copyright message
 *   -d, --debug      show debug message
 *   -t, --trace      write source code references in README.md
 *   --verbose        send README.md output to console
 *   --source         path to source folder (default: ./src)
 *   --trace          write source code references in README.md
 *   --file           name of output file (default: README.md)
 * ```
 *
 */
exports.usage = function()
{
	console.log('Usage: readme [options] <path>');
	console.log('');
	console.log('Example: readme --source=./www/js /home/mathew/thinkingmedia/readme');
	console.log('');
	console.log('Options:');
	console.log('  -h, --help       shows this usage message');
	console.log('  -v, --version    print version number');
	console.log('  -s, --silent     hides copyright message');
	console.log('  -d, --debug      show debug message');
	console.log('  -t, --trace      write source code references in README.md');
	console.log('  --verbose        send README.md output to console');
	console.log('  --source         path to source folder (default: ./src)');
	console.log('  --file           name of output file (default: README.md)');
};