/**
 * @ignore
 */
function Module() {

    /**
     * It is difficult to name of a Git repository actually. This filter will only return a value if the remote
     * origin URL is from Github.
     *
     * @memberof Plus.Filters
     * @param {string} value
     * @param {Object.<string,string>} git_local
     */
    var git_repo = function (value, git_local) {
        if (value) {
            return value;
        }
        if(!git_local) {
            return undefined;
        }
    };

    return ['git:local', git_repo];
}

module.exports = [
    Module
];