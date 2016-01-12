/**
 * @memberof Plus.Services
 * @typedef {Function}
 */
function Module(sprintfJs) {
    return sprintfJs.sprintf;
}

module.exports = [
    'sprintf-js',
    Module
];