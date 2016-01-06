/**
 * @param _
 * @param path
 * @returns {Function}
 */
function Module(_, path) {

    /**
     * @param {Plus.Engine} engine
     */
    return function () {
        return engine.apply_filters('git:repo').then(function (repo) {
            if (repo) {
                return repo;
            }
            return _.last(process.cwd().split(path.sep));
        });
    };
}

module.exports = [
    'lodash',
    'path',
    Module
];