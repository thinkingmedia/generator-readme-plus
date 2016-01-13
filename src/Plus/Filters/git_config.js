/**
 * @param _
 * @param {Plus.Services.Shell} Shell
 * @ignore
 */
function Module(_, Shell) {

    /**
     * git:config returns the config options for the current working directory.
     *
     * @memberof Plus.Filters
     * @param {Object.<string,string>=} config
     * @returns {Object.<string,string>}
     */
    var git_config = function (config) {
        if(config) {
            return config;
        }
        var output = Shell.has('git').exec('git config --local --list');
        return _.zipObject(_.map(_.compact(output.split("\n")), function (line) {
            return line.split("=");
        }));
    };

    return git_config;
}

module.exports = [
    'lodash',
    'Plus/Services/Shell',
    Module
];