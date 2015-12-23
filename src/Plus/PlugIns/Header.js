var dependencies = ['lodash', 'Plus/Services/Print', 'Plus/Files/Markdown', 'Plus/Services/Git', 'Plus/Services/GitHub', 'Plus/Files/Logger'];

define(dependencies, function (_, Print,
                               /** Plus.Files.Markdown */Markdown,
                               /** Plus.Services.Git */Git,
                               /** Plus.Services.GitHub */ GitHub,
                               /** Plus.Files.Logger */Logger) {

    /**
     * @param {Plus.Engine} engine
     * @param {string} section
     *
     * @constructor
     */
    var Plugin = function (engine, section) {

        var self = this;

        this.git = Git.getInfo();

        engine.add_filter(section, function (/** Plus.Files.Markdown */md) {
            return md;
        });

        engine.add_filter(section + ":title", function (title) {
            return self.git
                ? self.git.repo
                : title;
        });

        engine.add_filter(section + ":lines", function (/**string[]*/lines) {
            lines = self._getHeaderText(lines);

            self._prepend(lines, self._getImage());
            self._prepend(lines, self._getTagLine());

            return lines;
        });
    };

    /**
     * @param {string[]} lines
     * @param {string} text
     * @private
     */
    Plugin.prototype._prepend = function (lines, text) {
        if (text) {
            lines.unshift(text);
            lines.unshift('');
        }
    };

    /**
     * Loads the GitHub API details.
     */
    Plugin.prototype.initializing = function () {

        var self = this;
        var done = this.async();

        GitHub.getInfo().then(function (value) {
            self.values.url = value.url;
            self.values.tagLine = value.desc;
            done();
        }, function (err) {
            throw Error(err);
        });
    };

    /**
     * Extras re-usable text from the header section. Lines from tbe bottom up that start with alpha-numeric characters.
     *
     * @param {string[]} lines
     * @returns {string[]}
     * @private
     */
    Plugin.prototype._getHeaderText = function (lines) {
        lines = lines.slice();
        lines.reverse();
        lines = _.takeWhile(lines, function (line) {
            return line == '' || line.match(/^[\w\d\s]/i);
        });
        lines.reverse();
        return lines;
    };

    /**
     * Creates markdown for an image.
     * @returns {string|null}
     * @private
     */
    Plugin.prototype._getImage = function () {
        return this.git
            ? Print('![%s](https://github.com/%s/%s/raw/%s/%s.png)', this.git.repo, this.git.user, this.git.repo, this.git.branch, this.git.repo)
            : null;
    };

    /**
     * @returns {string|null}
     * @private
     */
    Plugin.prototype._getTagLine = function () {
        return this.tagLine
            ? Print('> %s', this.tagLine)
            : null;
    };

    return Plugin;
});