var dependencies = ['fs', 'Plus/Services/Print', 'Plus/Files/Logger', 'Plus/Services/Git'];

define(dependencies, function (fs, Print, /**Plus.Files.Logger*/Logger, /** Plus.Services.Git */Git) {

    /**
     * @readme plugins.Image
     *
     * To add an image to the top of the README file include a PNG file with the same name as the repository in the root
     * folder.
     *
     * @param {Plus.Engine} engine
     * @param {string} section
     *
     * @constructor
     */
    var Plugin = function (engine, section) {
        Logger.debug('Plugin %s: %s', 'Image', section);

        engine.add_filter(section + ":lines", function (/**string[]*/lines) {
            var git = Git.getInfo();
            if (git && fs.existsSync(git.repo + '.png')) {
                lines.unshift('');
                lines.unshift(Print('![%s](https://github.com/%s/%s/raw/%s/%s.png)', git.repo, git.user, git.repo, git.branch, git.repo));
            }
            return lines;
        });
    };

    return Plugin;
});