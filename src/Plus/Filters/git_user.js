/**
 * @param {Plus.Services.Git} Git
 * @returns {Function}
 * @ignore
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
     * @param {Plus.Engine} engine
     * @constructor
     */
    return function (/**string*/user) {
        return Git.getUser() || user || null;
    };
}

module.exports = [
    'Plus/Services/Git',
    Module
];