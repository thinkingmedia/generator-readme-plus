var dependencies = ['lodash', 'path'];

define(dependencies, function (_, path) {

    /**
     * @param {Plus.Engine} engine
     * @param {string} section
     * @param {Object<string,*>=} options
     */
    return function (engine, section, options) {
        options = _.merge({}, {title: 'auto'}, options);
        var directory_name = _.last(process.cwd().split(path.sep));

        engine.add_filter('project:title', function () {
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
});