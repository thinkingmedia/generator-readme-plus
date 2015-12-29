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

    describe('resolve', function () {
        validArgument(function (value) {
            _loader.resolve(value);
        });

        it('loads node modules', function () {
            var path = require('path');
            _loader.resolve('path').should.be.equal(path);
        });

        it('loads Plus modules', function () {
            var engine = _loader.resolve('Plus/Engine');
            engine.should.be.a.Function();
            (engine.prototype.render !== undefined).should.be.true();
        });
    });

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
            _loader.rewrite('Plus/Foo').should.be.equal('./Foo');
            _loader.rewrite('Plus/Foo/Bar').should.be.equal('./Foo/Bar');
        });
        it('returns path to json file', function () {
            _loader.rewrite('Plus/Foo.json').should.be.equal('./Foo.json');
            _loader.rewrite('Plus/Foo/Bar.json').should.be.equal('./Foo/Bar.json');
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

    describe('isJSON', function () {
        validArgument(function (value) {
            _loader.isJSON(value);
        });

        it('returns true for json files', function () {
            _loader.isJSON('Plus/Foo.json').should.be.true();
        });
        it('returns false for modules', function () {
            _loader.isJSON('Plus/Foo').should.be.false();
        });
    });

    describe('resolve_module', function () {
        validArgument(function (value) {
            _loader.resolve_module(value);
        });

        it('returns value if not array', function () {
            _loader.resolve_module("hello world").should.be.equal("hello world");
        });

        it('calls module function with no arguments', function () {
            var module = [function () {
                arguments.should.be.empty();
                return "something";
            }];
            _loader.resolve_module(module).should.be.equal("something");
        });

        it("calls module function with node module", function () {
            var module = ['path', function (path) {
                path.should.be.equal(require('path'));
                return "something";
            }];
            _loader.resolve_module(module).should.be.equal("something");
        });

        it("calls module function with Mock object", function () {
            function Foo() {

            }
            _loader.setCache('Plus/Foo', new Foo());
            var module = ['Plus/Foo', function (foo) {
                foo.should.be.an.Object().and.be.an.instanceOf(Foo);
                return "something";
            }];
            _loader.resolve_module(module).should.be.equal("something");
        });

    });

    describe('getValues', function () {
        validArgument(function (value) {
            _loader.getValues(value);
        });

        it('throws on empty array', function () {
            (function () {
                _loader.getValues([]);
            }).should.throw('not enough items in array');
        });

        it('returns empty array when length is 1', function () {
            _loader.getValues([_.noop]).should.be.empty();
        });

        it('returns array without last item', function () {
            _loader.getValues([1, 2, 3, 4, _.noop]).should.be.eql([1, 2, 3, 4]);
        });
    });

    describe('getMethod', function () {
        validArgument(function (value) {
            _loader.getMethod(value);
        });

        it('throws on empty array', function () {
            (function () {
                _loader.getMethod([]);
            }).should.throw('not enough items in array');
        });

        it('throws if last item is not a function', function () {
            (function () {
                _loader.getMethod([1, 2, 3, 4]);
            }).should.throw('last item in array must be function');
        });

        it('returns last item as function', function () {
            _loader.getMethod([1, 2, 3, 4, _.noop]).should.be.a.Function().and.be.equal(_.noop);
        });
    });
});