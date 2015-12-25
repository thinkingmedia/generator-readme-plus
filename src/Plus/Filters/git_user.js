var dependencies = ['Plus/Services/Git'];

define(dependencies, function (/** Plus.Services.Git */Git) {

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
        engine.add_filter("git:user", function (/**string*/user) {
            var git = Git.getInfo();
            return git ? git.user : user;
        });
    };
});