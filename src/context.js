/**
 * The root section of the document.
 *
 * @type {exports.Section}
 */
exports.root = require('./document/section.js').create('root');

/**
 * All the widgets for the document.
 *
 * @type {Array.<exports.Widget>}
 */
exports.widgets = [];