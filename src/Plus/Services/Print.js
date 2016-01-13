/**
 * @ignore
 */
function Module(sprintfJs) {

    /**
     * This is a string format function that uses sprintf style parameters.
     *
     * @memberof Plus.Services
     * @method
     * @static
     */
    var Print = sprintfJs.sprintf;

    return Print;
}

module.exports = [
    'sprintf-js',
    Module
];