load('Plus/Collections/LinkedList', function (/** Plus.Collections.LinkedList */LinkedList) {

    describe('LinkedList.Node', function () {
        describe('constructor', function () {
            it('sets defaults', function () {
                var n = new LinkedList.Node('something');
                n.value.should.be.equal('something');
                (n.prev === null).should.be.true();
                (n.next === null).should.be.true();
            });
        });
    });

    describe('LinkedList', function () {
        describe('constructor', function () {
            it('sets defaults', function () {
                var l = new LinkedList();
                (l.first === null).should.be.true();
                (l.last === null).should.be.true();
                l.count.should.be.equal(0);
            });
        });

        describe('clear', function () {
            it('sets defaults', function () {
                var l = new LinkedList();
                l.push('something');
                (l.first === null).should.be.false();
                (l.last === null).should.be.false();
                l.count.should.be.equal(1);

                l.clear();
                (l.first === null).should.be.true();
                (l.last === null).should.be.true();
                l.count.should.be.equal(0);
            });
        });

        describe('push', function () {
            it('makes first value first and last', function () {
                var l = new LinkedList();
                l.push('first_value');
                l.first.value.should.be.equal('first_value');
                l.last.value.should.be.equal('first_value');
                l.count.should.be.equal(1);
            });
            it('makes second value last', function () {
                var l = new LinkedList();
                l.push('first_value');
                l.push('second_value');
                l.first.value.should.be.equal('first_value');
                l.last.value.should.be.equal('second_value');
                l.count.should.be.equal(2);
            });
            it('makes third value last', function () {
                var l = new LinkedList();
                l.push('first_value');
                l.push('second_value');
                l.push('third_value');
                l.first.value.should.be.equal('first_value');
                l.last.value.should.be.equal('third_value');
                l.count.should.be.equal(3);
            });
        });

        describe('toArray', function () {
            it('returns an array of nodes', function () {
                var l = new LinkedList();
                l.push('first_value');
                l.push('second_value');
                l.push('third_value');
                var arr = l.toArray();
                arr.should.be.an.Array();
                arr.length.should.be.equal(3);
                arr[0].value.should.be.equal('first_value');
                arr[1].value.should.be.equal('second_value');
                arr[2].value.should.be.equal('third_value');
            });
        });
    });

});