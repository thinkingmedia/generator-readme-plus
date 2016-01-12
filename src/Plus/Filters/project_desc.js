/**
 * @param {Plus.Services.GitHub} GitHub
 * @returns {Function}
 * @ignore
 */
function Module(GitHub) {

    /**
     * @readme plugins.GitHub
     *
     * GitHub plugin adds filters to modify values when the remote origin points to the github.com domain.
     *
     * It supports the following filters.
     *
     *
     * @param {Plus.Engine} engine
     * @constructor
     */
    return function (/**string*/desc) {
        return GitHub.getInfo().then(function (value) {
            return value && value.desc;
        });
    };
}

module.exports = [
    'Plus/Services/GitHub',
    Module
];