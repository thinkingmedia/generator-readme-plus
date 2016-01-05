describe('Filter', function () {

    /**
     * @type {Plus.Engine.Filter}
     */
    var Filter;

    before(function () {
        var loader = new Loader();
        Filter = loader.resolve('Plus/Engine/Filter');
    });

    describe('constructor', function () {
        throws('if invalid name', function () {
            new Filter(null);
        }, 'Filter must have a name.');

        throws('if invalid hook', function () {
            new Filter('foo', null);
        }, 'Hook parameter must be a function.');

        it('sets a default priority', function () {
            var f = new Filter('foo', _.noop);
            f.priority.should.be.equal(50);
        });

        it('sets the name', function () {
            var f = new Filter('foo', _.noop);
            f.name.should.be.equal('foo');
        });

        it('sets the hook', function () {
            var f = new Filter('foo', _.noop);
            f.hook.should.be.Function().and.be.equal(_.noop);
        });

        it('sets a custom priority', function () {
            var f = new Filter('foo', _.noop, 99);
            f.priority.should.be.equal(99);
        });
    });
});