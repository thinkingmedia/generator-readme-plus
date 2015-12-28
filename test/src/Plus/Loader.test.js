describe('Loader', function () {
    var Loader;
    /**
     * @type {Plus.Loader}
     */
    var _loader;

    before(function () {
        Loader = require('../../../src/Plus/Loader');
    });
    beforeEach(function () {
        _loader = new Loader();
    });

    it('require returns the constructor function', function () {
        Loader.should.be.a.Function();
        _loader.should.not.be.null().and.be.an.instanceOf(Loader);
    });

    function validArgument(method) {
        it('throws on false arguments', function () {
            _.each([null, undefined, false, ''], function (value) {
                (function () {
                    method(value);
                }).should.throw('invalid argument');
            });
        });
    }

    describe('isPlus', function () {
        validArgument(function (value) {
            _loader.isPlus(value);
        });

        it('should return true', function () {
            _loader.isPlus('Plus/Foo').should.be.true();
            _loader.isPlus('Plus/Foo.json').should.be.true();
            _loader.isPlus('Plus/Foo/Bar').should.be.true();
            _loader.isPlus('Plus/Foo/Bar.json').should.be.true();
        });

        it('should return false', function () {
            _loader.isPlus('Plus/').should.be.false();
            _loader.isPlus('Plus.').should.be.false();
            _loader.isPlus('/Plus').should.be.false();
            _loader.isPlus('Plus/Foo/').should.be.false();
            _loader.isPlus('fs').should.be.false();
            _loader.isPlus('path').should.be.false();
        });
    });

    describe('rewrite', function () {
        validArgument(function (value) {
            _loader.rewrite(value);
        });

        it('returns path to module', function () {
            _loader.rewrite('Plus/Foo').should.be.equal('./Plus/Foo');
            _loader.rewrite('Plus/Foo/Bar').should.be.equal('./Plus/Foo/Bar');
        });
        it('returns path to json file', function () {
            _loader.rewrite('Plus/Foo.json').should.be.equal('./Plus/Foo.json');
            _loader.rewrite('Plus/Foo/Bar.json').should.be.equal('./Plus/Foo/Bar.json');
        });

        it('can not rewrite none-namespace paths', function () {
            (function () {
                _loader.rewrite('path');
            }).should.throw('not a namespace');
        });
    });

    describe('replace', function () {
        validArgument(function (value) {
            _loader.replace(value, "value");
        });

        it('instance with new instance', function () {
            function Foo() {
            }

            function Mock() {
            }

            _loader._cache['Plus/Foo'] = new Foo();
            _loader.getCached('Plus/Foo').should.be.instanceOf(Foo);
            _loader.replace('Plus/Foo', new Mock());
            _loader.getCached("Plus/Foo").should.be.instanceOf(Mock);
        });
    });

    describe('isCached', function () {
        validArgument(function (value) {
            _loader.isCached(value);
        });

        it('should be false', function () {
            _loader.isCached('Plus/Foo').should.be.false();
        });

        it('should be true', function () {
            _loader._cache['Plus/Foo'] = 'something';
            _loader.isCached('Plus/Foo').should.be.true();
        });
    });

    describe('setCache', function () {
        validArgument(function (value) {
            _loader.setCache(value, "something");
        });

        it('updates the cache', function () {
            (typeof _loader._cache['Plus/Foo']).should.be.equal('undefined');
            _loader.setCache('Plus/Foo', "something");
            _loader._cache['Plus/Foo'].should.be.equal("something");
        });
    });

    describe('getCached', function () {
        validArgument(function (value) {
            _loader.getCached(value);
        });

        it('throws for missing item', function () {
            (function () {
                _loader.getCached('Plus/Foo')
            }).should.throw('Plus/Foo is not cached.');
        });

        it('returns cached item', function () {
            _loader._cache['Plus/Foo'] = 'something';
            _loader.getCached('Plus/Foo').should.be.equal('something');
        });
    });
});