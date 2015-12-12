var _ = require('lodash');
var shell = require('shelljs');

var config = false;

/**
 * Checks the GIT is installed on the command line.
 */
exports.assert = function () {
    if (!shell.which('git')) {
        throw new Error('git command line tool was not found.');
    }
};

/**
 * Gets the name of the current repo.
 *
 * @return {Object<string,string>}
 */
exports.getConfig = function () {
    exports.assert();
    if (config !== false) {
        return config;
    }
    var output = shell.exec('git config --local --list', {silent: true}).output.trim();
    config = _.zipObject(_.map(_.compact(output.split("\n")), function (line) {
        return line.split("=");
    }));
    return config;
};

/**
 * Gets the URL for the repo.
 *
 * @return {string|boolean}
 */
exports.getRemote = function() {
    var config = exports.getConfig();
    return config['remote.origin.url'] || false;
};
