/**
 * @param _
 * @param {Plus.Services.Shell} Shell
 * @ignore
 */
function Module(_, Shell) {

    /**
     * git:global returns the config options for the current working directory.
     *
     * @memberof Plus.Filters
     * @param {Object.<string,string>=} config
     * @returns {Object.<string,string>}
     */
    var git_global = function (config) {
        if (config) {
            return config;
        }
        var output = Shell.has('git').exec('git config --global --list').replace(/\r/g, '');
        return _.fromPairs(_.compact(_.map(output.split("\n"), function (line) {
            return line.indexOf("=") > 0 ? line.split("=") : undefined;
        })));
    };

    return git_global;
}

module.exports = [
    'lodash',
    'Plus/Services/Shell',
    Module
];