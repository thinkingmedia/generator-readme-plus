/**
 * @param {Plus.Services.Print} Print
 * @ignore
 */
function Module(Print) {

    /**
     * @readme plugins.GitHub
     *
     * GitHub plugin adds filters to modify values when the remote origin points to the github.com domain.
     *
     * It supports the following filters.
     */
    return ['git:user', 'git:repo', 'git:branch', function (url, user, repo, branch) {
        return Print('https://github.com/%s/%s/raw/%s/%s', user, repo, branch, url);
    }];
}

module.exports = [
    'Plus/Services/Print',
    Module
];