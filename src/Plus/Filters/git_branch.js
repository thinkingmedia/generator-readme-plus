/**
 * @param {Plus.Services.Git} Git
 * @returns {Function}
 */
function Module(Git) {

    /**
     * @readme plugins.Git
     *
     * This plugin uses the Git status of the current working folder to update properties like repository name,
     * current branch and username.
     *
     * It supports the following filters.
     *
     * - git:repo string The repository name.
     * - git:branch string The current branch.
     * - git:user string The current username (if configured).
     *
     * @param {Plus.Engine} engine
     * @constructor
     */
    return function (engine) {
        engine.add_filter("git:branch", function (/**string*/branch) {
            var git = Git.getInfo();
            return git ? git.branch : branch;
        });
    };
}

module.exports = [
    'Plus/Services/Git',
    Module
];