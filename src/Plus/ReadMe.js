var dependencies = ['requirejs', 'fs', 'Plus/Engine', 'Plus/Files/Markdown', 'Plus/Files/Logger'];

define(dependencies, function (requirejs, fs, /** Plus.Engine */Engine, /**Plus.Files.Markdown*/Markdown, /**Plus.Files.Logger*/Logger) {

    /**
     * @name Plus.ReadMe
     * @param {string} fileName
     * @constructor
     */
    var ReadMe = function (fileName) {
        this.engine = new Engine();
        this.fileName = fileName;

        // should this be done to the Markdown?
        this.engine.add_section('root');
        this.engine.add_section('root/header');

        this.plugins = [];
        this.plugins.push(new (requirejs('Plus/Plugins/Header'))(this.engine, 'root/header'));
    };

    /**
     *
     */
    ReadMe.prototype.render = function () {

        /**
         * @type {Plus.Files.Markdown/null}
         */
        var original = fs.existsSync(this.fileName)
            ? Markdown.load(this.fileName)
            : null;

        // keep original root
        this.engine.add_filter('root', function (/**Plus.Files.Markdown*/md) {
            return original
                ? original.clone().dropChildren().trim()
                : md;
        },10);

        // keep original header
        this.engine.add_filter('root/header', function (/**Plus.Files.Markdown*/md) {
            var header = original && original.firstChild();
            return header
                ? header.clone().dropChildren().trim()
                : md;
        },10);

        this.result = this.engine.render();
    };

    /**
     * @param fileName
     * @returns {boolean}
     */
    ReadMe.prototype.save = function (fileName) {
        if(!this.result) {
            return false;
        }
        this.result.save(fileName);
    };

    return ReadMe;
});