/**
 * @param _
 * @param {Plus.Files.Logger} Logger
 * @returns {Plugin}
 */
function Module(_, Logger) {

    /**
     * @readme plugins.Slogan
     *
     * Slogan plugin adds a quote caption to the README header under the title. The slogan is taken from one of these
     * possible sources. You can disable this plugin by assigning `false` to the option.
     *
     * - the GitHub repository description
     * - user defined string in the options
     *
     * Example custom title:
     *
     * ```
     *    grunt.initConfig({
     *        readme: {
     *           options: {
     *               slogan: "My Fancy Slogan"
     *           }
     *        }
     *    });
     * ```
     *
     * @param {Plus.Engine} engine
     * @param {string} section
     * @param {Object<string,*>} options
     *
     * @constructor
     */
    var Plugin = function (engine, section, options) {
        Logger.debug('Plugin %s: %s', 'Slogan', section);

        options = _.merge({}, {slogan: true}, options);

        engine.add_filter(section + ":lines", function (/**string[]*/lines) {
            if (options.slogan === false) {
                return lines;
            }
            if (_.isString(options.slogan)) {
                lines.unshift('');
                lines.unshift('> ' + options.slogan);
                return lines;
            }
            return engine.apply_filters('git:desc').then(function (desc) {
                if (desc) {
                    lines.unshift('');
                    lines.unshift('> ' + desc);
                }
                return lines;
            });
        });
    };

    return Plugin;
}

module.exports = [
    'lodash',
    'Plus/Files/Logger',
    Module
];