/**
 * @param {Plus.Services.Git} Git
 * @ignore
 */
function Module(Git) {

    /**
     * This plugin uses the Git status of the current working folder to update properties like repository name,
     * current branch and username.
     *
     * @memberof Plus.Filters
     * @param {string} repo
     */
    var git_repo = function (repo) {
        return Git.getRepo() || repo || null;
    };

    return [git_repo];
}

module.exports = [
    'Plus/Services/Git',
    Module
];