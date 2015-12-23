var dependencies = ['Plus/Services/Print', 'Plus/Files/Logger', 'Plus/Services/Git', 'Plus/Services/GitHub'];

define(dependencies, function (Print, /**Plus.Files.Logger*/Logger, /** Plus.Services.Git */Git, /** Plus.Services.GitHub */GitHub) {

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
    var Plugin = function (engine) {
        Logger.debug('Plugin %s', 'GitHub');

        engine.add_filter("image:url", function (/**string*/url) {
            var git = Git.getInfo();
            if (!git) {
                return url;
            }
            return Print('https://github.com/%s/%s/raw/%s/%s', git.user, git.repo, git.branch, url);
        });

        engine.add_filter("git:desc", function (/**string*/desc) {
            return GitHub.getInfo().then(function (value) {
                return value && value.desc;
            });
        });
    };

    return Plugin;
});