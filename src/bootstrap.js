require('winston').cli();
require('./params.js').init();

var $fs = require('fs');
var $dust = require('dustjs-linkedin');

$dust.debugLevel = 'DEBUG';
$dust.onLoad = function(name, callback)
{
	var path = "./template/" + name + ".dust";
	if($fs.existsSync(path))
	{
		callback(undefined, $fs.readFileSync(path, 'utf8'));
		return;
	}
	callback(new Error("Template not found: " + path), undefined);
};
