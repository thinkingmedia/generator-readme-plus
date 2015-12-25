var dependencies = ['module', 'path', 'lodash', 'requirejs', 'fs', 'Plus/Engine', 'Plus/Files/Markdown', 'Plus/Files/Logger', 'Plus/Collections/Arrays'];

define(dependencies, function (module, path, _, requirejs, fs, /** Plus.Engine */Engine, /**Plus.Files.Markdown*/Markdown, /**Plus.Files.Logger*/Logger, /**Plus.Collections.Arrays*/Arrays) {

    /**
     * @param {string} path
     * @returns {string[]}
     */
    function getFiles(path) {
        var files = fs.readdirSync(path.dirname(module.uri) + path.sep + path);
        return _.filter(files, function (file) {
            return _.endsWith(file, '.js') && !_.startsWith(file, '_');
        });
    }

    /**
     * @name Plus.ReadMe
     * @param {string} fileName
     * @param {Object<string,*>} options
     * @constructor
     */
    var ReadMe = function (fileName, options) {
        this.engine = new Engine();
        this.fileName = fileName;

        // should this be done to the Markdown?
        this.engine.add_section('root');
        this.engine.add_section('root/header');
        this.engine.add_section('root/license');

        this.plugins = [];

        this.engine.loadFilters(getFiles('Filters'));

        //this.plugins.push(new (requirejs('Plus/Plugins/Git'))(this.engine, _.clone(options, true)));
        //this.plugins.push(new (requirejs('Plus/Plugins/GitHub'))(this.engine, _.clone(options, true)));
        //this.plugins.push(new (requirejs('Plus/Plugins/Title'))(this.engine, 'root/header', _.clone(options, true)));
        //this.plugins.push(new (requirejs('Plus/Plugins/Image'))(this.engine, 'root/header', _.clone(options, true)));
        //this.plugins.push(new (requirejs('Plus/Plugins/Slogan'))(this.engine, 'root/header', _.clone(options, true)));
        //this.plugins.push(new (requirejs('Plus/Plugins/License'))(this.engine, 'root/license', _.clone(options, true)));

        // handle overwrites for options
        this.engine.add_filter('project:title', function (value) {
            return options.title
                ? options.title
                : value;
        }, 99);
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