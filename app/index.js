var generators = require('yeoman-generator');

/**
 * @class
 * @lends yo.YeomanGeneratorBase
 **/
var readMe = {
    /**
     * @constructs
     */
    constructor: function () {
        generators.Base.apply(this, arguments);
        this.option('coffee', {});
    },

    method1: function () {
        console.log('method 1 just run');
    }
};

module.exports = generators.Base.extend(readMe);