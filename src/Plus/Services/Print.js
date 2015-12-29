/**
 * @name Plus.Services.Print
 * @typedef {Function}
 */
function Module(sprintfJs) {
    return sprintfJs.sprintf;
}

module.exports = [
    'sprintf-js',
    Module
];