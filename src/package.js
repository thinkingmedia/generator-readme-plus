/**
 * @type {Program}
 */
var program = require('./program.js');

var parser = require("nomnom");

parser.command('install')
	.callback(function(options)
			  {
				  program.install();
			  })
	.help('Automates the creation of the readme.json file.');

parser.command('update')
	.callback(function(options)
			  {
				  program.update();
			  })
	.help('Updates the README.md file.');

parser.script('readme')
	.nocolors()
	.parse();

