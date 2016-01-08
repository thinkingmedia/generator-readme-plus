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
        throws('Filter must have a name.', function () {
            new Filter(null);
        });

        throws('Hook parameter must be a function.', function () {
            new Filter('foo', null);
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
            f._hook.should.be.Function().and.be.equal(_.noop);
        });

        it('accepts an array for callback', function () {
            var f = new Filter('foo', [_.noop]);
            f._hook.should.be.a.Function().and.be.equal(_.noop);
            f = new Filter('foo', ['one', 'two', 'three', _.noop]);
            f._hook.should.be.a.Function().and.be.equal(_.noop);
        });

        it('sets a custom priority', function () {
            var f = new Filter('foo', _.noop, 99);
            f.priority.should.be.equal(99);
        });

        it('sets the dependencies', function () {
            var f = new Filter('foo', ['one', 'two', 'three', _.noop]);
            f._resolve.should.be.an.Array().and.be.eql(['one', 'two', 'three']);
        })
    });

    describe('block', function () {
        throws('Filter has circular dependency.', function () {
            var f = new Filter('foo', _.noop);
            f.block(function () {
                f.block(_.noop);
            })
        });
        it('executes the callback', function () {
            var f = new Filter('foo', _.noop);
            var count = 0;
            f.block(function () {
                count++;
            });
            count.should.be.equal(1);
        });
    });

    describe('getResolved', function () {
        promise('calls apply for all dependencies', function () {
            var f = new Filter('foo', ['one', 'two', _.noop]);
            var count = 0;
            var mock = {
                apply: function (name) {
                    (name === 'one' || name === 'two').should.be.True();
                    count++;
                    return 'three';
                }
            };
            var p = f.getResolved(mock);
            p.then(function (arr) {
                arr.should.be.an.Array().and.be.eql(['three', 'three']);
                count.should.be.equal(2);
            });
            return p;
        });
    });

    describe('getValue', function () {
        promise('resolves to filter value', function () {
            var count = 0;
            var f = new Filter('foo', function (value) {
                count++;
                return value + 10;
            });
            var p = f.getValue({}, 10);
            p.then(function (value) {
                value.should.be.equal(20);
                count.should.be.equal(1);
            });
            return p;
        });
        promise('injects dependency into filter call', function () {
            var count = 0;
            var f = new Filter('foo', ['one', function (value, one) {
                value.should.be.equal('Hello');
                one.should.be.equal('World');
                count++;
                return value + ' ' + one;
            }]);
            var mock = {
                apply: function () {
                    count++;
                    return 'World';
                }
            };
            var p = f.getValue(mock, 'Hello');
            p.then(function (result) {
                result.should.be.equal('Hello World');
                count.should.be.equal(2);
            });
            return p;
        });
    });

});