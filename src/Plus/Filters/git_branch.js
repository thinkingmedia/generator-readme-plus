/**
 * @param Q
 * @param path
 * @ignore
 */
function Module(Q, path) {

    /**
     * git:branch returns the current working branch of the current working Git folder.
     *
     * @memberof Plus.Filters
     * @param {string} branch
     * @param {string} path
     * @returns {string}
     */
    var git_branch = function (branch, path) {
        if (branch) {
            return branch;
        }
        var def = Q.defer();
        Git.Repository.open(path).then(function (repo) {
            repo.config().then(function (config) {
                def.resolve(config);
            });
        });
        return def.promise;
    };

    return ['project:path', git_branch];
}

module.exports = [
    'q',
    'path',
    Module
];