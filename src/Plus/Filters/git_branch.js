function Module(Q, path, Git) {

    /**
     * @readme filters.GitBranch
     *
     * `git:branch` returns the current working branch of the current working Git folder.
     */
    return ['project:path', function (branch, path) {
        return 'chicken';
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
    }];
}

module.exports = [
    'q',
    'path',
    'nodegit',
    Module
];