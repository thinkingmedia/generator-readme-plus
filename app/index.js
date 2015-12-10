var generators = require('yeoman-generator');

/**
 * @class
 * @lends yo.YeomanGeneratorBase
 **/
var readMePlus = {
    initializing: function () {
        this.props = {};
    },

    prompting: function () {
        var done = this.async();

        this.prompt([{
            type: 'input',
            name: 'name',
            message: 'Project Name',
            default: 'Hello World'
        },{
            type: 'confirm',
            name: 'toc',
            message: 'Table Of Contents',
            default: true
        }], function (answers) {
            this.log(answers);
            done();
        }.bind(this));
    },

    writing: function () {
        //var readme = this.fs.read(this.destinationPath('README+.md'));
        //console.log(readme);
        //this.fs.writeJSON(this.destinationPath('README+.md'), readme);
    }
};

module.exports = generators.Base.extend(readMePlus);