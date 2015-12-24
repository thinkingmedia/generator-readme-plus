var dependencies = ['module', 'path', 'fs', 'Q', 'lodash', 'Plus/Services/Similarity', 'Plus/Files/Logger', 'Plus/Services/Strings', './_licenses/licenses.json'];

define(dependencies, function (module, path, fs, Q, _, /** Plus.Services.Similarity */Similarity, /**Plus.Files.Logger*/Logger, /**Plus.Services.Strings*/Strings, Licenses) {

    /**
     * @param {string} value
     * @returns {string}
     */
    function TrimBuffer(value) {
        value = value.replace(/[\r\n]/g, " ").replace(/\s+/g, " ");
        value = Strings.stripTags(value);
        value = Strings.stripPunctuation(value);
        return value.toLowerCase().replace(/\s+/g, " ").trim();
    }

    /**
     * @readme plugins.License
     *
     * License plugin adds the footer to the README for the current license.
     *
     * @param {Plus.Engine} engine
     * @param {string} section
     * @param {Object<string,*>} options
     *
     * @constructor
     */
    var Plugin = function (engine, section, options) {
        Logger.debug('Plugin %s: %s', 'License', section);

        options = _.merge({}, {license: true}, options);

        if (options.license === false) {
            return;
        }

        engine.add_filter(section, function (/**Plus.Files.Markdown*/md) {

            var fileName = _.find(['LICENSE', 'LICENSE.txt', 'LICENSE.md'], function (fileName) {
                return fs.existsSync(fileName);
            });
            if (!fileName) {
                Logger.error('Project has no licence.');
                return md;
            }

            var file = TrimBuffer(fs.readFileSync(fileName, 'UTF8'));

            var scored = _.map(Licenses, function (license) {
                var text = fs.readFileSync(path.dirname(module.uri) + "/_licenses/" + license.file, 'UTF8');
                if (!text) {
                    throw Error("Unable to read license file: " + license.file);
                }
                text = TrimBuffer(text);
                var score = Similarity.similarity(text, file);
                //Logger.debug("%s - %1.3f", license.file, score);
                Logger.debug("%s - %s", license.file, score);
                return _.merge({}, {score: score}, license);
            });

            var license = _.first(_.sortByOrder(scored, 'score', 'desc'));
            if (license.score < 0.95) {
                Logger.error('Could not resolve type of license.');
                return md;
            }

            //Logger.info("%s - %1.3f", license.file, license.score);

            var title = engine.apply_filters('licence:title', 'Licence');
            var desc = engine.apply_filters('license:desc', '<%= name %> is licenced under the <%= licence %s>.');

            return Q.spread([title, desc], function (title, desc) {
                md.title = title.trim();
                md.lines = [desc];
                return md;
            });
        });
    };

    return Plugin;
});