/**
 * @param Q
 * @param _
 * @param {Plus.Engine.Sections} Sections
 * @ignore
 */
function Module(Q, _, Sections) {

    /**
     * Engine takes take of rendering the final Markdown.
     *
     * @memberof Plus
     * @param {Plus.Engine.Filters} filters
     * @param {Plus.Engine.Sections} sections
     * @constructor
     */
    var Engine = function (filters, sections) {
        if (!filters) {
            throw Error('invalid filters');
        }
        if (!sections) {
            throw Error('invalid sections');
        }
        this._filters = filters;
        this._sections = sections;
    };

    /**
     * @private
     */
    Engine.prototype._beforeRender = function () {
        this._filters.beforeRender();
        this._sections.beforeRender();
    };

    /**
     * Filter each section by it's creationOrder
     *
     * @returns {Array.<Promise<Plus.Engine.Section>>}
     * @private
     */
    Engine.prototype._filterSections = function () {
        return _.map(this._sections.byCreationOrder(), function (/** Plus.Engine.Section*/section) {
            return this._filters.render(section);
        }.bind(this));
    };

    /**
     * Call this method to create the output Markdown.
     *
     * @returns {Promise<Plus.Files.Markdown>}
     */
    Engine.prototype.render = function () {

        this._beforeRender();

        var promises = this._filterSections();

        return Q.all(promises).then(function (items) {
            var sections = new Sections(items);
            return sections.getMarkdown();
        });
    };

    return Engine;
}

module.exports = [
    'q',
    'lodash',
    'Plus/Engine/Sections',
    Module
];
