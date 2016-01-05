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

    /**
     * @type {Plus.Files.Markdown}
     */
    var Markdown;

    before(function () {
        var loader = new Loader();
        Engine = loader.resolve('Plus/Engine/Engine');
        Filters = loader.resolve('Plus/Engine/Filters');
        Sections = loader.resolve('Plus/Engine/Sections');
        Markdown = loader.resolve('Plus/Files/Markdown');
    });

    /**
     * Creates a test engine with data.
     *
     * @returns {Plus.Engine}
     */
    function CreateEngine() {
        var f = new Filters();
        f.add('test', _.noop);

        var s = new Sections();
        s.append('root');
        s.append('root/header');

        return new Engine(f, s);
    }

    describe('constructor', function () {
        throws('if invalid filters argument', function () {
            var e = new Engine(null, new Sections());
        }, 'invalid filters');
        throws('if invalid sections argument', function () {
            var e = new Engine(new Filters(), null);
        }, 'invalid sections');
    });

    describe('_filterSections', function () {
        it('returns an array of promises', function () {
            var e = CreateEngine();
            var arr = e._filterSections();
            arr.should.be.an.Array();
            arr.should.be.length(2);
            _.each(arr, function (item) {
                item.should.be.a.Promise();
            });
        });
    });

    describe('engine', function () {
        promise('returns a promise that resolves to Markdown', function () {
            var e = CreateEngine();
            var p = e.render();
            p.should.be.a.Promise();
            return p.then(function (/**Plus.Files.Markdown*/md) {
                md.should.be.an.instanceOf(Markdown);
                var str = md.toString();
                str.should.be.equal("#");
            });
        });
    });
});
