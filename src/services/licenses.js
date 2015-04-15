var _ = require('lodash');
var fs = require('fs');
var logger = require('winston');
var strings = require("../utils/strings");
var similarity = require("../utils/similarity.js");

var params = require('../params.js');
var reader = require('../files/reader.js');
var licenses = require("./_licenses/licenses.json");

exports.create = function(options)
{
	var plugin = function(options)
	{
		this.name = 'licenses';
		this.valid = true;

		function trim(str)
		{
			str = str.replace(/[\r\n]/g," ").replace(/\s+/g," ");
			str = strings.stripTags(str);
			str  = strings.stripPunctuation(str);
			return  str.toLowerCase().replace(/\s+/g," ").trim();
		}


		this.start = function()
		{
			this._file = reader.readFirst([
											  params.work + "LICENSE",
											  params.work + "LICENSE.txt",
											  params.work + "LICENSE.md"
										  ]);

			if(this._file)
			{
				this.info('Found LICENSE');
				this._file = trim(this._file);
			}
			return this.valid = true;
		};

		this.write = function(root, services)
		{
			if(!this._file)
			{
				return;
			}

			_.each(licenses, function(license)
			{
				var text = reader.read(__dirname + "/_licenses/" + license.file);
				if(!text)
				{
					throw new Error("Unable to read license file: " + license.file);
				}
				text = trim(text);
				license.score = similarity.similarity(text,this._file);
				this.debug("%s - %1.3f", license.file, license.score);
			},this);
			var license = _.first(_.sortBy(licenses,'score').reverse());
			this.info("%s - %1.3f", license.file, license.score);
		}
	};

	return new plugin(options);
};
