/**
 * @param Q
 * @param _
 * @param {Plus.Engine.Filters} Filters
 * @param {Plus.Engine.Sections} Sections
 * @param {Plus.Collections.Arrays} Arrays
 *
 * @returns {Plus.Engine}
 */
function Module(Q, _, Filters, Sections, Arrays) {

    /**
     * @name Plus.Engine
     *
     * @param {Plus.Engine.Filters} filters
     * @param {Plus.Engine.Sections} sections
     *
     * @constructor
     */
    var Engine = function (filters, sections) {
        if (!filters) {
            throw Error('invalid filters');
        }
        if (!sections) {
            throw Error('invalid sections');
        }
        this._filters = new Filters();
        this._sections = new Sections();
    };

    /**
     * @private
     */
    Engine.prototype._beforeRender = function () {
        _.each([this._filters, this._sections], function (obj) {
            obj._beforeRender();
        });
    };

    /**
     * @todo Markdown should be created and attached to sections.
     *
     * @param {Plus.Engine.Section} section
     * @returns {Promise<Plus.Engine.Section>}
     * @private
     */
    Engine.prototype._filterSection = function (section) {
        var self = this;
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
    };

    /**
     * @returns {Promise<Plus.Engine.Section>[]}
     * @private
     */
    Engine.prototype._filterSections = function () {
        // filter each section by it's creationOrder
        return _.map(this._sections.byCreationOrder(), function (/** Plus.Engine.Section*/section) {
            return this._filterSection(section);
        }.bind(this));
    };

    /**
     * @todo this should create the main Markdown without having to append to Markdown objects owned by sections.
     * @todo this can be moved to Sections
     *
     * @param {Plus.Engine.Section[]} items
     * @returns {Plus.Files.Markdown}
     * @private
     * @deprecated
     */
    Engine.prototype._getMarkdown = function (items) {
        if (!_.isArray(items) || items.length === 0) {
            throw Error('invalid argument');
        }

        var sections = new Sections(items);

        if (!sections.contains('root')) {
            throw Error('Sections do not have a root.');
        }

        // append sections to their parents by their order
        _.each(sections.byOrder(), function (/** Plus.Engine.Section*/section) {
            if (section.name === 'root') {
                return;
            }
            var parent = sections.parent(section.name);
            if (parent) {
                parent.markdown.appendChild(section.markdown);
            } else {
                throw Error('Section missing parent');
            }
        });

        return sections.find('root').markdown;
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
    'Q',
    'lodash',
    'Plus/Engine/Filters',
    'Plus/Engine/Sections',
    'Plus/Collections/Arrays',
    Module
];
