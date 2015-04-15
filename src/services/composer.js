var _ = require('lodash');
var fs = require('fs');
var shell = require('shelljs');
var logger = require('winston');
var sprintf = sprintf = require("sprintf-js").sprintf;
var params = require('../params.js');

exports.create = function(options)
{
	var plugin = function(options)
	{
		this.name = 'composer';
		this.valid = false;

		this.start = function()
		{
			return this.valid = true;
		};

		/**
		 * Test the default title for the readme.
		 */
		this.beforeWrite = function(root, services)
		{
		};
	};
	return new plugin(options);
};
