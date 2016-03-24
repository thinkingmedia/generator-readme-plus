/**
 * @param _
 * @param {Plus.Services.Shell} Shell
 * @ignore
 */
function Module(_, Shell) {

    /**
     * git:local returns the config options for the current working directory.
     *
     * @memberof Plus.Filters
     * @param {Object.<string,string>=} config
     * @returns {Object.<string,string>}
     */
    var git_local = function (config) {
        if (config) {
            return config;
        }
        var output = Shell.has('git').exec('git config --local --list').replace(/\r/g, '');
        return _.fromPairs(_.compact(_.map(output.split("\n"), function (line) {
            return line.indexOf("=") > 0 ? line.split("=") : undefined;
        })));
    };

    return git_local;
}

module.exports = [
    'lodash',
    'Plus/Services/Shell',
    Module
];