var dependencies = ['lodash', 'path'];

define(dependencies, function (_, path) {

    /**
     * @param {Plus.Engine} engine
     */
    return function (engine) {
        engine.add_filter('project:title', function () {
            return engine.apply_filters('git:repo').then(function (repo) {
                if (repo) {
                    return repo;
                }
                return _.last(process.cwd().split(path.sep));
            });
        });
    };
});