load('Plus/Services/Cache', function (/**Plus.Services.Cache*/Cache) {

    describe('constructor', function () {
        it('creates an empty cache', function () {
            var c = new Cache();
            (c._expires === null).should.be.True();
            c._data.should.be.eql({});
        });
        it('sets the expires date/time', function () {
            var c = new Cache(new Date(2016, 10, 10, 3, 24, 0), 120);
            c._expires.should.be.eql(new Date(2016, 10, 10, 5, 24, 0));
        });
    });

    describe('getExpired', function () {
        it('returns expire date/time', function () {
            var c = new Cache(new Date(2016, 10, 10, 3, 24, 0), 120);
            c._expires.should.be.eql(new Date(2016, 10, 10, 5, 24, 0));
        });
        it('tells if saving is disabled', function () {
            var c = new Cache();
            (c.getExpires() === null).should.be.True();
        });
    });

    describe('getTTL', function () {
        it('returns TTL in minutes', function () {
            var c = new Cache(new Date(2016, 10, 10, 3, 24, 0), 120);
            c.getTTL().should.be.equal(120);
        });
    });

    describe('toObject', function () {
        it('just returns the inner data', function () {
            var c = new Cache();
            c.put('test', 'hello world');
            c.toObject().should.be.eql({
                test: 'hello world'
            });
        });
    });

    describe('put', function () {
        it('inserts a named entry', function () {
            var c = new Cache();
            c.put('test', 'hello world');
            c._data.test.should.be.equal('hello world');
        });
    });

    describe('get', function () {
        it('retrieves named data stored in the cache', function () {
            var c = new Cache();
            c.put('test', 'hello world');
            c.get('test').should.be.equal('hello world');
        });
    });

    describe('remove', function () {
        it('removes an entry from the cache', function () {
            var c = new Cache();
            c.put('test', 'hello world');
            c.remove('test');
            c._data.hasOwnProperty('test').should.be.False();
        });
    });

    describe('clear', function () {
        it('clears the cache', function () {
            var c = new Cache();
            c.put('test', 'hello world');
            c._data.should.not.be.eql({});
            c.clear();
            c._data.should.be.eql({});
        });
    });

    describe('has', function () {
        it('checks if the cache contains a key', function () {
            var c = new Cache();
            c.has('test').should.be.False();
            c.put('test', 'hello world');
            c.has('test').should.be.True();
        });
    })
});