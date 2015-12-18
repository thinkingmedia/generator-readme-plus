define(['lodash', 'fs', 'shell', 'sprintf-js', 'Files/Logger'], function (_, fs, shell, sprintf, /** Logger */Logger) {

    /**
     * @name Plus.Git
     *
     * @constructor
     */
    var Git = function () {
        if (!shell.which('git')) {
            Logger.error('git command line tool was not found.');
            return;
        }
        var output = shell.exec('git config --local --list', {silent: true}).output.trim();
        this.cache = _.zipObject(_.map(_.compact(output.split("\n")), function (line) {
            return line.split("=");
        }));

        if (!this.cache['remote.origin.url']) {
            throw Error('"remote.origin.url" is missing from Git info.');
        }
    };

    /**
     * Gets the username and repo name for the current working folder. Assumes it's a GitHub repo.
     *
     * @returns {{user:string,repo:string,branch:string}|undefined}
     */
    Git.prototype.getInfo = function () {
        return Git.getUserRepo(this.cache['remote.origin.url']);
    };

    /**
     * Extracts the username/organization and repo name from a GitHub URL address.
     * Uses a simplified approach because Git urls can have a wide range of formats.
     *
     * @param {string} url
     * @returns {{user:string,repo:string,branch:string}|undefined}
     */
    Git.getUserRepo = function (url) {
        if (url.indexOf('github.com') === -1) {
            return undefined;
        }

        url = url.trim().toLowerCase().replace("://", ":");
        if (url.indexOf('/') === -1) {
            return undefined;
        }
        var path = url.substr(url.indexOf('/') + 1);
        path = path.replace(/\?.*/, '');
        path = path.replace(/#.*/, '');

        // just get the first 2 levels
        var parts = _.take(_.map(path.split('/'), function (part) {
            return _.endsWith(part, ".git") ? part.substr(0, part.indexOf('.git')) : part;
        }), 2);

        if (parts.length !== 2) {
            // this isn't a valid url
            return undefined;
        }

        if (!parts[0] || !parts[1]) {
            return undefined;
        }

        // assume first 2 levels are username and repo
        // @todo Figure out what branch this is.
        return {
            'user': parts[0],
            'repo': parts[1],
            'branch': 'master'
        };
    };

    return new Git();
});
