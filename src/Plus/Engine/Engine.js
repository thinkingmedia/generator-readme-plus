/**
 * @param Q
 * @param _
 * @param {Plus.Engine.Filters} Filters
 * @param {Plus.Collections.Arrays} Arrays
 * @param {Plus.Engine.Sections} Sections
 *
 * @returns {Plus.Engine}
 */
function Module(Q, _, Filters, Arrays, Sections) {

    /**
     * @name Plus.Engine
     *
     * @constructor
     */
    var Engine = function () {
        this._filters = new Filters();
        this._sections = new Sections();
    };

    /**
     * @returns {promise}
     */
    Engine.prototype.render = function () {

        this._sections.beforeRender();
        this._filters.beforeRender();

        // filter each section by it's creationOrder
        var self = this;
        var promises = _.map(this._sections.byCreationOrder(), function (/** Plus.Engine.Section*/section) {
            return self._filters.apply(section.name, section.markdown).then(function (/**Plus.Files.Markdown*/md) {
                // filter properties
                var title = self._filters.apply(section.name + ":title", md.title);
                var lines = self._filters.apply(section.name + ":lines", md.lines);
                // return a promise that resolves to a section
                return Q.spread([title, lines], function (title, lines) {
                    section.markdown = md.clone();
                    section.markdown.title = title.trim();
                    section.markdown.lines = Arrays.trim(lines);
                    return section;
                });
            });
        });

        // catches some common bugs during development
        if (_.filter(promises).length != self._sections.count()) {
            throw Error('Incorrect number of section promises.');
        }

        // promise that resolves to final Markdown object.
        return Q.all(promises).then(function (items) {
            var sections = new Sections(items);
            if (sections.count() != self._sections.count()) {
                throw Error('Incorrect number of sections.');
            }
            // append sections to their parents by their order
            _.each(sections.byOrder(), function (/** Plus.Engine.Section*/section) {
                if (section.name === 'root') {
                    return;
                }
                var parent = sections.parent(section.name);
                if (parent) {
                    parent.markdown.appendChild(section.markdown);
                }
            });

            return sections.find('root').markdown;
        });
    };

    return Engine;
}

module.exports = [
    'Q',
    'lodash',
    'Plus/Engine.Filters',
    'Plus/Collections/Arrays',
    'Plus/Engine/Sections',
    Module
];
