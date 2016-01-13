/**
 * @param _
 * @param {Plus.Services.Shell} Shell
 * @ignore
 */
function Module(_, Shell) {
    /**
     * git:branch returns the current working branch of the current working Git folder.
     *
     * @memberof Plus.Filters
     * @param {string} branch
     * @returns {string}
     */
    var git_branch = function (branch) {
        return branch || Shell.has('git').exec('git rev-parse --abbrev-ref HEAD').trim();
    };

    return git_branch;
}

module.exports = [
    'q',
    'Plus/Services/Shell',
    Module
];