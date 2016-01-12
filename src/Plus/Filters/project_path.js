/**
 * @returns {Function}
 * @ignore
 */
function Module(path) {

    /**
     * @readme filters.ProjectPath
     *
     * project:path returns the working folder for the current project. This is usually the current directory.
     */
    return function () {
        return path.resolve(process.cwd());
    };
}

module.exports = [
    'path',
    Module
];