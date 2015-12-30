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
        it('throws if invalid name', function () {
            (function () {
                new Filter(null);
            }).should.throw('Filter must have a name.');
        });

        it('throws if invalid hook', function () {
            (function () {
                new Filter('foo', null);
            }).should.throw('Hook parameter must be a function.');
        });

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