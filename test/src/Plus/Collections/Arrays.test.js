load('Plus/Collections/Arrays', function (/** Plus.Collections.Arrays */Arrays) {

    describe('toString', function () {
        it('empty arrays returns empty string', function () {
            Arrays.toString([]).should.be.equal('');
        });
        it('joins together to a single string', function () {
            Arrays.toString(['one', 'two', 'three']).should.be.equal('one\ntwo\nthree');
        });
    });

    describe('trimEach', function () {
        it('empty arrays are unchanged', function () {
            Arrays.trimEach([]).should.be.eql([]);
        });
        it('trims each string', function () {
            Arrays.trimEach(['  one  ', 'two  ']).should.be.eql(['one', 'two']);
        });
        it('trims only strings', function () {
            Arrays.trimEach(['  one  ', {}, 3]).should.be.eql(['one', {}, 3]);
        });
    });

    describe('trim', function () {
        it('removes empty lines from start', function () {
            Arrays.trim(['', '', ' one  ', '', 'two']).should.be.eql(['one', '', 'two']);
        });
        it('removes empty lines from end', function () {
            Arrays.trim([' one  ', '', 'two']).should.be.eql(['one', '', 'two']);
        });
    });

    describe('toArray', function () {
        it('converts the parameter to an array', function () {
            Arrays.toArray('string').should.be.eql(['string']);
        });
        it('null returns empty array', function () {
            Arrays.toArray(null).should.be.eql([]);
        });
        it('undefined returns empty array', function () {
            Arrays.toArray(undefined).should.be.eql([]);
        });
        it('no parameters returns empty array', function () {
            Arrays.toArray().should.be.eql([]);
        });
    });

    describe('first', function () {
        it('returns first item', function () {
            Arrays.first(['one', 'two', 'three']).should.be.equal('one');
        });
        it(['non-array is returned as is'], function () {
            Arrays.first('something').should.be.equal('something');
        });
        it(['empty array returns undefined'], function () {
            (typeof Arrays.first([])).should.be.equal('undefined');
            (typeof Arrays.first(null)).should.be.equal('undefined');
            (typeof Arrays.first(undefined)).should.be.equal('undefined');
        });
    });
});