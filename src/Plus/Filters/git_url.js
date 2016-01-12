/**
 * @param {Plus.Services.Print} Print
 */
function Module(Print) {

    /**
     * @readme plugins.GitHub
     *
     * GitHub plugin adds filters to modify values when the remote origin points to the github.com domain.
     *
     * It supports the following filters.
     *
     * - image:url string Rewrites the URL as a github.com URL
     * - git:desc string The description assigned to the repository by the owner.
     */
    return ['git:user', 'git:repo', 'git:branch', function (url, user, repo, branch) {
        return Print('https://github.com/%s/%s/raw/%s/%s', user, repo, branch, url);
    }];
}

module.exports = [
    'Plus/Services/Print',
    Module
];