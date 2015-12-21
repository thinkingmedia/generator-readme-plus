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
    var Writer = function (engine, section) {

        engine.add_filter(section, function (/** Plus.Files.Markdown */md) {
            return md;
        }, 10);

        return;

        this.git = Git.getInfo();
        this.values = _.merge({}, {
            title: this.git.repo,
            image: true,
            imageName: this.git.repo + '.png',
            url: false,
            tagLine: false
        });
    };

    /**
     * Loads the GitHub API details.
     */
    Writer.prototype.initializing = function () {

        if (!!this.values.tagLine || !!this.values.url) {
            return;
        }

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
    Writer.prototype._getHeaderText = function (lines) {
        lines = lines.slice();
        lines.reverse();
        lines = _.takeWhile(lines, function (line) {
            return line == '' || line.match(/^[\w\d\s]/i);
        });
        lines.reverse();
        return lines;
    };

    /**
     * @param {Markdown} root
     * @private
     */
    Writer.prototype._getHeader = function (root) {
        if (!root.firstChild()) {
            root.appendChild(new Markdown(this.values.title));
        }
        return root.firstChild();
    };

    /**
     * Creates markdown for an image.
     * @returns {string}
     * @private
     */
    Writer.prototype._getImage = function () {
        if (!this.values.image) {
            return '';
        }
        return Print('![%s](https://github.com/%s/%s/raw/%s/%s.png)', this.git.repo, this.git.user, this.git.repo, this.git.branch, this.git.repo);
    };

    /**
     * @returns {string}
     * @private
     */
    Writer.prototype._getTitle = function () {
        return this.values.title;
    };

    Writer.prototype._getTagLine = function () {
        return sprintf('> %s', this.values.tagLine);
    };

    /**
     * @param {Markdown} root
     */
    Writer.prototype.writing = function (root) {
        var head = this._getHeader(root);
        head.title = this._getTitle();
        head.lines = _.flatten([
            this._getTagLine(),
            '',
            this._getImage(),
            '',
            this._getHeaderText(head.lines)
        ]);
    };

    return Writer;
});