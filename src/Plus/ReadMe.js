var dependencies = ['requirejs', 'Plus/Engine', 'Plus/Files/Markdown'];

define(dependencies, function (requirejs, /** Plus.Engine */Engine, /**Plus.Files.Markdown*/Markdown) {

    /**
     * @name Plus.ReadMe
     * @param {string} fileName
     * @constructor
     */
    var ReadMe = function (fileName) {
        this.engine = new Engine();

        // should this be done to the Markdown?
        this.engine.add_section('root');
        this.engine.add_section('root/header');

        this.plugins = [];
        this.plugins.push(new requirejs('Plus/Plugins/Header')(this.engine, 'root/header'));

        this.md = Markdown.load(fileName);
    };

    /**
     */
    ReadMe.prototype.render = function () {
        this.engine.render(this.md);
    };

    /**
     * @param fileName
     */
    ReadMe.prototype.save = function(fileName) {

    };

    return ReadMe;
});