var dependencies = ['lodash', 'path', 'Plus/Files/Logger'];

define(dependencies, function (_, path, /**Plus.Files.Logger*/Logger) {

    /**
     * @readme plugins.Title
     *
     * Title plugin will check the following list for a string value. The first check to resolve a title is used.
     *
     * - options.title from the Grunt options
     * - name of the remote origin repository
     * - name of the working directory
     *
     * Example custom title:
     *
     * ```
     *    grunt.initConfig({
     *        readme: {
     *           options: {
     *               title: "My Fancy Title"
     *           }
     *        }
     *    });
     * ```
     *
     * @param {Plus.Engine} engine
     * @param {string} section
     * @param {Object<string,*>=} options
     *
     * @constructor
     */
    var Plugin = function (engine, section, options) {
        Logger.debug('Plugin %s: %s', 'Title', section);

        options = _.merge({}, {title: 'auto'}, options);
        var directory_name = _.last(process.cwd().split(path.sep));

        engine.add_filter(section + ":title", function () {
            if (options.title === 'auto') {
                return engine.apply_filters('git:repo', directory_name).then(function (repo) {
                    return repo;
                });
            }
            if (_.isString(options.title)) {
                return options.title;
            }
            return directory_name;
        });
    };

    return Plugin;
});