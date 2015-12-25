var dependencies = ['Plus/Services/Print', 'Plus/Services/Git'];

define(dependencies, function (Print, /** Plus.Services.Git */Git) {

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
    return function (engine) {
        engine.add_filter("git:url", function (/**string*/url) {
            var git = Git.getInfo();
            if (!git) {
                return url;
            }
            return Print('https://github.com/%s/%s/raw/%s/%s', git.user, git.repo, git.branch, url);
        });
    };
});