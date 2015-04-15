var fs = require('fs');
var logger = require('winston');

exports.create = function(options)
{
	var plugin = function(options)
	{
		this.name = 'codeclimate';
		this.valid = true;

		this.write = function(root, services)
		{
			// check if the token exists in the travis file
			var travis = (services.travis._file || '').trim().toUpperCase().indexOf('CODECLIMATE_REPO_TOKEN') !== -1;

			// check if the dependency exists in the package.json file
			var depend = services.package.json && services.package.json['dependencies'] && services.package.json['dependencies']['codeclimate-test-reporter'];
			var devDepend = services.package.json && services.package.json['devDependencies'] && services.package.json['devDependencies']['codeclimate-test-reporter'];

			if(!travis && !depend && !devDepend)
			{
				return;
			}

			var info = services.git.info();
			if(info)
			{
				var url = "https://codeclimate.com/github/" + info.user + "/" + info.repo;
				var img = url + "/badges/gpa.svg";
				root.addBadge('title', 'Core Climate', img, url);
			}
		}
	};
	return new plugin(options);
};
