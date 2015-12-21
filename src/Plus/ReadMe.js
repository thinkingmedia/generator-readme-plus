var dependencies = ['requirejs', 'Plus/Engine'];

define(dependencies, function (requirejs, /** Plus.Engine */Engine) {

    /**
     * @name Plus.ReadMe
     * @constructor
     */
    var ReadMe = function () {
        this.engine = new Engine();
        this.plugins = [];
        this.plugins.push(new requirejs('Plus/Plugins/Header')(this.engine));
    };

    /**
     * @param {Plus.Files.Markdown} md
     */
    ReadMe.prototype.render = function (md) {
        this.engine.render(md);
    };

    return ReadMe;
});