describe('Engine', function () {

    /**
     * @type {Plus.Engine}
     */
    var Engine;

    /**
     * @type {Plus.Engine.Filters}
     */
    var Filters;

    /**
     * @type {Plus.Engine.Sections}
     */
    var Sections;

    before(function () {
        var loader = new Loader();
        Engine = loader.resolve('Plus/Engine/Engine');
        Filters = loader.resolve('Plus/Engine/Filters');
        Sections = loader.resolve('Plus/Engine/Sections');
    });

    describe('constructor', function () {
        it('throws if invalid filters argument', function () {
            (function () {
                var e = new Engine(null, new Sections());
            }).should.throw('invalid filters');
        });
        it('throws if invalid sections argument', function () {
            (function () {
                var e = new Engine(new Filters(), null);
            }).should.throw('invalid sections');
        });
    });

    describe('_beforeRender', function () {
        it('calls beforeRender on sections', function () {
            throw Error('not finished');
        });
        it('calls beforeRender on filters', function () {
            throw Error('not finished');
        });
    });

    describe('_filterSection', function () {
        it('throws on invalid arguments', function(){
            throw Error();
        });
        it('filters the section markdown', function() {
            throw Error();
        });
        it('filters the section title', function() {
            throw Error();
        });
        it('filters the section lines', function() {
            throw Error();
        });
        it('returns a promise that resolves to the section', function() {
            throw Error();
        });
    });

    describe('_filterSections', function () {
        it('returns an array equal to number of sections',function(){
            throw Error();
        });
        it('returns an array of promises',function(){
            throw Error();
        });
        it('calls _filterSection for each section',function(){
            throw Error();
        });
    });

    describe('engine', function(){
        it('calls _beforeRender',function(){
            throw Error();
        });

        it('calls _filterSections',function(){
            throw Error();
        });

        it('returns a promise that resolves to Markdown',function(){
            throw Error();
        });
    });
});
