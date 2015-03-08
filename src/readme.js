var parser = require("nomnom")
	.option('debug', {
				abbr: 'd',
				flag: true,
				help: 'Print debugging info..'
			});

parser.parse();