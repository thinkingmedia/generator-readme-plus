var $fs = require('fs');
var $_ = require('lodash');
var $S = require('string');
var $path = require('path');

function getDirectories(path)
{
	var files = $fs.readdirSync(path);
	return $_.chain(files)
		.filter(function(file)
				{
					if($S(file).startsWith("."))
					{
						return false;
					}
					return $fs.statSync(file).isDirectory();
				})
		.map(function(file)
			 {
				 return path + $path.sep + file;
			 })
		.sort()
		.value();
}

var dirs = getDirectories(process.cwd());

console.log(dirs);