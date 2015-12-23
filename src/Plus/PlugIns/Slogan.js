var dependencies = ['Plus/Files/Logger', 'Plus/Services/GitHub'];

define(dependencies, function (/**Plus.Files.Logger*/Logger, /** Plus.Services.GitHub */GitHub) {

    /**
     * @readme plugins.Slogan
     *
     * Adds the GitHub repository description as a slogan to the header of the README file.
     *
     * @param {Plus.Engine} engine
     * @param {string} section
     *
     * @constructor
     */
    var Plugin = function (engine, section) {
        Logger.debug('Plugin %s: %s', 'Slogan', section);
        engine.add_filter(section + ":lines", function (/**string[]*/lines) {
            return GitHub.getInfo().then(function (value) {
                lines.unshift('> ' + value.desc);
                lines.unshift('');
                return lines;
            });
        });
    };

    return Plugin;
});