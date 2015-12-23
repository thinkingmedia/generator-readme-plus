var dependencies = ['Plus/Files/Logger','Plus/Services/Git'];

define(dependencies, function (/**Plus.Files.Logger*/Logger,/** Plus.Services.Git */Git) {

    /**
     * @param {Plus.Engine} engine
     * @param {string} section
     *
     * @constructor
     */
    var Plugin = function (engine, section) {
        Logger.debug('Plugin %s: %s', 'Title', section);
        engine.add_filter(section + ":title", function (title) {
            var git = Git.getInfo();
            return git
                ? git.repo
                : title;
        });
    };

    return Plugin;
});