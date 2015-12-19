define(['requirejs', 'Engine'], function (requirejs, /** Plus.Engine */Engine) {

    /**
     * Load plugins
     */
    requirejs('Plugins/Header');

    /**
     * @name Plus.ReadMe
     * @constructor
     */
    var ReadMe = function () {

    };

    /**
     * @param {Plus.Markdown} md
     */
    ReadMe.prototype.render = function(md) {
        Engine.render(md);
    };

    return new ReadMe();
});