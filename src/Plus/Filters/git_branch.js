/**
 * @param {Plus.Services.Git} Git
 *
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
     */
    return function (/**string*/branch) {
        return Git.getBranch() || branch || 'master';
    };
}

module.exports = [
    'Plus/Services/Git',
    Module
];