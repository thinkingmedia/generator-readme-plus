var dependencies = ['Plus/Files/Logger', 'Plus/Services/Git'];

define(dependencies, function (/**Plus.Files.Logger*/Logger, /** Plus.Services.Git */Git) {

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
    var Plugin = function (engine) {
        Logger.debug('Plugin %s', 'Git');

        var git = Git.getInfo();

        engine.add_filter("git:repo", function (/**string*/repo) {
            return git ? git.repo : repo;
        });
        engine.add_filter("git:branch", function (/**string*/branch) {
            return git ? git.branch : branch;
        });
        engine.add_filter("git:user", function (/**string*/user) {
            return git ? git.user : user;
        });
    };

    return Plugin;
});