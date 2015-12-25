var dependencies = ['Q', 'lodash', 'Plus/Services/Licenses', 'Plus/Files/Logger'];

define(dependencies, function (Q, _, /** Plus.Services.Licenses */Licenses, /** Plus.Files.Logger */Logger) {

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

            var fileName = Licenses.getFileName();
            if (!fileName) {
                Logger.error('Project has no licence.');
                return md;
            }
            var license = Licenses.getLicence(fileName);

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