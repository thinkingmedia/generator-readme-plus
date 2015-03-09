var $fs = require('fs');
var $_ = require('lodash');
var $S = require('string');
var $path = require('path');

/**
 * @type {Readers}
 */
var $readers = require('./readers/package.js');

/**
 * Recursively finds all files.
 *
 * @param {string} path
 * @param {function(string,Object)} callback
 */
function findFiles(path, callback)
{
	$fs.readdir(path, function(err, files)
	{
		$_.each(files, function(file)
		{
			var $file = $S(file);
			if($file.startsWith("."))
			{
				return;
			}
			var fullPath = path + $path.sep + file;
			$fs.stat(fullPath, function(err, stats)
			{
				if(stats.isDirectory())
				{
					findFiles(fullPath, callback);
					return;
				}
				if($readers.hasReader(fullPath))
				{
					var reader = $readers.getReader(fullPath);
					callback(fullPath, reader);
				}
			});
		});
	});
}

findFiles(process.cwd() + $path.sep + "src", function(file, reader)
{
	console.log(reader);
	console.log(file);
});
