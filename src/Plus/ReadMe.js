var dependencies = ['lodash', 'requirejs', 'fs', 'Plus/Engine', 'Plus/Files/Markdown', 'Plus/Files/Logger', 'Plus/Collections/Arrays'];

define(dependencies, function (_, requirejs, fs, /** Plus.Engine */Engine, /**Plus.Files.Markdown*/Markdown, /**Plus.Files.Logger*/Logger, /**Plus.Collections.Arrays*/Arrays) {

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
        this.plugins.push(new (requirejs('Plus/Plugins/Title'))(this.engine, 'root/header'));
        this.plugins.push(new (requirejs('Plus/Plugins/Image'))(this.engine, 'root/header'));
        this.plugins.push(new (requirejs('Plus/Plugins/Slogan'))(this.engine, 'root/header'));
    };

    /**
     * @param {string} fileName
     */
    ReadMe.prototype.render = function (fileName) {

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
        }, 10);

        // keep original header
        this.engine.add_filter('root/header', function (/**Plus.Files.Markdown*/md) {
            //console.log('header');
            var header = original && original.firstChild();
            return header
                ? header.clone().dropChildren().trim()
                : md;
        }, 10);

        // keep partial text from header
        this.engine.add_filter('root/header:lines', function (/**string[]*/lines) {
            lines.reverse();
            lines = _.takeWhile(lines, function (line) {
                return line == '' || line.match(/^[\w\d\s]/i);
            });
            lines.reverse();
            lines = Arrays.trim(lines);
            return lines;
        }, 10);

        return this.engine.render().then(function (/** Plus.Files.Markdown */md) {
            md.save(fileName);
            return true;
        });
    };

    return ReadMe;
});