/**
 * @param _
 * @param fs
 * @param Print
 * @param {Plus.Files.Logger} Logger
 * @returns {Plugin}
 */
function Module(_, fs, Print, /**Plus.Files.Logger*/Logger) {

    /**
     * @readme plugins.Image
     *
     * Image plugin will add any PNG/GIF image file that matches the name of the remote origin repository.
     *
     * You can specify the name of the image file in the options, or assign `false` to disable images.
     *
     * ```
     *    grunt.initConfig({
     *        readme: {
     *           options: {
     *               image: 'example.png'
     *           }
     *        }
     *    });
     * ```
     * @param {Plus.Engine} engine
     * @param {string} section
     * @param {Object<string,*>} options
     *
     * @constructor
     */
    var Plugin = function (engine, section, options) {
        Logger.debug('Plugin %s: %s', 'Image', section);

        options = _.merge({}, {image: true}, options);

        if (!options.image) {
            return;
        }

        engine.add_filter(section + ":lines", function (/**string[]*/lines) {
            return engine.apply_filters('git:repo').then(function (repo) {
                if (!repo) {
                    return lines;
                }
                var fileName = options.image;
                if (fileName === true) {
                    if (fs.existsSync(repo + '.png')) {
                        fileName = repo + '.png';
                    } else if (fs.existsSync(repo + '.gif')) {
                        fileName = repo + '.gif';
                    }
                    if (!fileName) {
                        return lines;
                    }
                }
                return engine.apply_filters('image:url', fileName).then(function (url) {
                    lines.unshift('');
                    lines.unshift(Print('![%s](%s)', repo, url));
                    return lines;
                });
            });
        });
    };

    return Plugin;
}

module.exports = [
    'lodash',
    'fs',
    'Plus/Services/Print',
    'Plus/Files/Logger',
    Module
];