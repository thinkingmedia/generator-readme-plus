/**
 * @param shell
 * @ignore
 */
function Module(shell) {

    /**
     * This is a simple service that makes executing shell commands easier to test. It's just a simple function that
     * takes a single argument, and returns the shell output.
     *
     * @memberof Plus.Services
     * @param {string} cmd
     * @returns {string}
     */
    var Shell = function (cmd) {
        return shell.exec(cmd, {silent: true}).output.trim();
    };

    /**
     * This function verifies that a command line tool exists on the executable path.
     *
     * @memberof Plus.Services
     * @param {string} cmd
     * @returns {Plus.Services.Shell}
     */
    Shell.has = function (cmd) {
        if (!shell.which(cmd)) {
            throw Error(cmd + ' command line tool was not found.');
        }
        return this;
    };

    /**
     * This is an alias method for Shell()
     *
     * @memberof Plus.Services
     * @type {Plus.Services.Shell}
     */
    Shell.exec = Shell;

    return Shell;
}

module.exports = [
    'shelljs',
    Module
];