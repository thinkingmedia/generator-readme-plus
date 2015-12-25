var dependencies = ['Plus/Services/GitHub'];

define(dependencies, function (/** Plus.Services.GitHub */GitHub) {

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
        engine.add_filter("git:desc", function (/**string*/desc) {
            return GitHub.getInfo().then(function (value) {
                return value && value.desc;
            });
        });
    };
});