/**
 * @param _
 * @param path
 */
function Module(_, path) {

    /**
     * @param {string} repo
     */
    return ['git:repo', function (repo) {
        return repo || _.last(process.cwd().split(path.sep));
    }];
}

module.exports = [
    'lodash',
    'path',
    Module
];