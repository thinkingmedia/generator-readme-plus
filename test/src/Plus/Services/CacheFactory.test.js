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
                CacheFactory.get('Test').should.be.an.instanceOf(Cache);
                CacheFactory.count().should.be.equal(1);
                CacheFactory.clear();
                CacheFactory.count().should.be.equal(0);
            });
        });

        describe('get', function () {
            it('creates a cache object', function () {
                CacheFactory.has('Test').should.be.False();
                CacheFactory.get('Test').should.be.an.instanceOf(Cache);
                CacheFactory.has('Test').should.be.True();
            });
            it('always returns the same instance', function () {
                var c = CacheFactory.get('Test');
                c.should.be.an.instanceOf(Cache);
                CacheFactory.get('Test').should.be.equal(c);
            });
        });

        describe('toObject', function () {
            it('returns empty object if factory is empty', function () {
                CacheFactory.toObject().should.be.equal({});
            });
            it('attaches each cache to the object', function () {
                var c = CacheFactory.get('Test');
                c.should.be.an.instanceOf(Cache);
                var obj = CacheFactory.toObject();
                obj.hasOwnProperty('Test').should.be.True();
                obj.Test.cache.should.be.equal(c.toObject());
                obj.Test.TTL.should.be.instanceOf(Date);
            });
        });

        describe('save', function () {
            throws('invalid fileName', function () {
                CacheFactory.save(null);
            });
            writes('data to disk', function (loader) {
                var factory = loader.resolve('Plus/Services/CacheFactory');
                factory.get('Test').put('name', 'thinkingmedia');
                factory.save('readme.json');
                this.output.should.be.equal('{}');
            });
        });

        describe('load', function () {
            it.skip('serializes from disk', function () {

            });
            it.skip('discards any caches that have expired', function () {

            });
            it.skip('does nothing if file is not found', function () {

            });
        })

    });