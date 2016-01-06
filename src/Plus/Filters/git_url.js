/**
 * @param {Plus.Services.Print} Print
 * @param {Plus.Services.Git} Git
 * @returns {Function}
 */
function Module(Print, Git) {

    /**
     * @readme plugins.GitHub
     *
     * GitHub plugin adds filters to modify values when the remote origin points to the github.com domain.
     *
     * It supports the following filters.
     *
     * - image:url string Rewrites the URL as a github.com URL
     * - git:desc string The description assigned to the repository by the owner.
     *
     * @param {Plus.Engine} engine
     * @constructor
     */
    return function (/**string*/url) {
        var g = Git.getInfo();
        if (!g) {
            return url;
        }
        return Print('https://github.com/%s/%s/raw/%s/%s', g.user, g.repo, g.branch, url);
    };
}

module.exports = [
    'Plus/Services/Print',
    'Plus/Services/Git',
    Module
];