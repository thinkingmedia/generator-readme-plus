describe('Section', function () {

    /**
     * @type {Plus.Engine.Section}
     */
    var Section;

    /**
     * @type {Plus.Files.Markdown}
     */
    var Markdown;

    before(function () {
        var loader = new Loader();
        Section = loader.resolve('Plus/Engine/Section');
        Markdown = loader.resolve('Plus/Files/Markdown');
    });

    describe('constructor', function () {
        throws('Section must have a name.', function () {
            new Section();
        });

        throws('Only the root is allowed to be top-level: Foo', function () {
            new Section('Foo');
        });

        throws('Must be a child of the root: Foo/Bar', function () {
            new Section('Foo/Bar');
        });

        it('sets default order', function () {
            var section = new Section('root/header');
            section.order.should.be.equal(50);
        });

        it('sets order as 99', function () {
            var section = new Section('root/header', 99);
            section.order.should.be.equal(99);
            section.creationOrder.should.be.equal(50);
        });

        it('sets creationOrder as 88', function () {
            var section = new Section('root/header', 99, 88);
            section.order.should.be.equal(99);
            section.creationOrder.should.be.equal(88);
        });

        it('creates empty Markdown', function () {
            var section = new Section('root/header');
            section.markdown.should.be.instanceOf(Markdown);
        });
    });


});