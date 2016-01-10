load([
        'Plus/Services/CacheFactory',
        'Plus/Services/Cache'
    ],
    function (/**Plus.Services.CacheFactory*/CacheFactory,
              /**Plus.Services.Cache*/Cache) {

        beforeEach(function () {
            CacheFactory.clear();
        });

        describe('singleton', function () {
            it('is injected as a service', function () {
                CacheFactory.should.be.an.Object();
            });
        });

        describe('clear', function () {
            it('clears the caches from memory', function () {
                CacheFactory.count().should.be.equal(0);
                CacheFactory.create('Test').should.be.an.instanceOf(Cache);
                CacheFactory.count().should.be.equal(1);
                CacheFactory.clear();
                CacheFactory.count().should.be.equal(0);
            });
        });

        describe('create', function () {
            throws('cache Test already exists.', function () {
                CacheFactory.create('Test');
                CacheFactory.create('Test');
            });
            it('creates a new cache', function () {
                CacheFactory.has('Test').should.be.False();
                var c = CacheFactory.create('Test');
                CacheFactory.has('Test').should.be.True();
                c.should.be.an.instanceOf(Cache);
            });
        });

        describe('get', function () {
            throws('cache Test not found.', function () {
                CacheFactory.get('Test');
            });
            it('creates a cache object', function () {
                var c1 = CacheFactory.create('Test');
                var c2 = CacheFactory.get('Test');
                c1.should.be.an.instanceOf(Cache);
                c2.should.be.an.instanceOf(Cache);
                c1.should.be.equal(c2);
            });
        });

        describe('toObject', function () {
            it('returns empty object if factory is empty', function () {
                CacheFactory.toObject().should.be.eql({version: 1, caches: []});
            });
            it('sets a version', function () {
                CacheFactory.create('Test', new Date(2015, 1, 1, 0, 0, 0), 60);
                var obj = CacheFactory.toObject();
                obj.version.should.be.equal(1);
            });
            it('stores caches in an array', function () {
                CacheFactory.create('Test', new Date(2015, 1, 1, 0, 0, 0), 60);
                var obj = CacheFactory.toObject();
                obj.caches.should.be.an.Array().and.length(1);
            });
            it('attaches each cache to the object', function () {
                CacheFactory.create('Test', new Date(2015, 1, 1, 0, 0, 0), 60);
                var obj = CacheFactory.toObject();
                obj.caches.should.be.length(1);
                obj.caches[0].should.be.eql({
                    name: 'Test',
                    expires: '2015-02-01T06:00:00.000Z',
                    ttl: 60,
                    data: {}
                });
            });
            it('skips caches without a TTL', function () {
                CacheFactory.create('John');
                CacheFactory.create('Smith', new Date(), 120);
                var obj = CacheFactory.toObject();
                obj.caches.should.be.an.Array().and.length(1);
                obj.caches[0].name.should.be.equal('Smith');
            });
        });

        describe('fromObject', function () {
            throws('unexpected data in cache file.', function () {
                CacheFactory.fromObject({
                    version: 1,
                    caches: [
                        {name: 'Test'}
                    ]
                });
            });
            throws('unsupported version', function () {
                CacheFactory.fromObject({
                    version: 2
                });
            });
            throws('expected an array', function () {
                CacheFactory.fromObject({
                    version: 1,
                    caches: {}
                });
            });
            it('clears the caches', function () {
                CacheFactory.create('Test');
                CacheFactory.fromObject({
                    version: 1,
                    caches: []
                });
                CacheFactory.count().should.be.equal(0);
            });
            it('keeps if not expired', function () {
                var obj = {
                    version: 1,
                    caches: [
                        {
                            name: 'Test',
                            expires: (new Date(2099, 1, 1)).toJSON(),
                            ttl: 60,
                            data: {
                                name: 'ThinkingMedia'
                            }
                        }
                    ]
                };
                CacheFactory.fromObject(obj);
                var c = CacheFactory.get('Test');
                c.should.be.instanceOf(Cache);
                c.get('name').should.be.equal('ThinkingMedia');
            });
            it('skips expired caches', function () {
                var obj = {
                    version: 1,
                    caches: [
                        {
                            name: 'Test',
                            expires: (new Date(1999, 1, 1)).toJSON(),
                            ttl: 60,
                            data: {
                                name: 'ThinkingMedia'
                            }
                        }, {
                            name: 'Smith',
                            expires: (new Date(2099, 1, 1)).toJSON(),
                            ttl: 60,
                            data: {
                                name: 'House'
                            }
                        }
                    ]
                };
                CacheFactory.fromObject(obj);
                CacheFactory.has('Test').should.be.False();
                var c = CacheFactory.get('Smith');
                c.should.be.an.instanceOf(Cache);
                c.get('name').should.be.equal('House');
            });
        });

        describe('save', function () {
            throws('invalid fileName', function () {
                CacheFactory.save(null);
            });
            writes('basic file if no caches', function (loader) {
                /**
                 * @type {Plus.Services.CacheFactory}
                 */
                var factory = loader.resolve('Plus/Services/CacheFactory');
                factory.create('Test').put('name', 'thinkingmedia');
                factory.save('readme.json');
            }, function (name, value) {
                name.should.be.equal('readme.json');
                value.should.be.equal('{"version":1,"caches":[]}');
            });
            writes('data to disk', function (loader) {
                /**
                 * @type {Plus.Services.CacheFactory}
                 */
                var factory = loader.resolve('Plus/Services/CacheFactory');
                factory.create('Test', new Date(2015, 1, 1), 60).put('name', 'thinkingmedia');
                factory.save('readme.json');
            }, function (name, value) {
                name.should.be.equal('readme.json');
                value.should.be.equal('{"version":1,"caches":[{"name":"Test","expires":"2015-02-01T06:00:00.000Z","ttl":60,"data":{"name":"thinkingmedia"}}]}');
            });
        });

        describe('load', function () {
            throws('invalid fileName', function () {
                CacheFactory.load(null);
            });

            reads('empty file', function (loader) {
                var factory = loader.resolve('Plus/Services/CacheFactory');
                (function () {
                    factory.load('readme.json');
                }).should.throw('invalid file: readme.json');
            }, '');

            reads('loads caches that have not expired', function (loader) {
                /**
                 * @type {Plus.Services.CacheFactory}
                 */
                var factory = loader.resolve('Plus/Services/CacheFactory');
                factory.load('readme.json');
                var c = factory.get('Test');
                // @todo why does this fail?
                //c.should.be.an.instanceOf(Cache);
                c.get('name').should.be.equal('thinkingmedia');
            }, '{"version":1,"caches":[{"name":"Test","expires":"2099-02-01T06:00:00.000Z","ttl":60,"data":{"name":"thinkingmedia"}}]}', function (name) {
                name.should.be.equal('readme.json');
            });

            reads('skips caches that have expired', function (loader) {
                /**
                 * @type {Plus.Services.CacheFactory}
                 */
                var factory = loader.resolve('Plus/Services/CacheFactory');
                factory.load('readme.json');
                factory.has('Test').should.be.False();
            }, '{"version":1,"caches":[{"name":"Test","expires":"1999-02-01T06:00:00.000Z","ttl":60,"data":{"name":"thinkingmedia"}}]}', function (name) {
                name.should.be.equal('readme.json');
            });
        })

    });