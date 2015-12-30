describe('Sections', function () {

    /**
     * @type {Plus.Engine.Sections}
     */
    var Sections;

    /**
     * @type {Plus.Engine.Section}
     */
    var Section;

    /**
     * @type {Plus.Engine.Sections}
     */
    var target;

    before(function () {
        var loader = new Loader();
        Sections = loader.resolve('Plus/Engine/Sections');
        Section = loader.resolve('Plus/Engine/Section');
    });

    beforeEach(function () {
        target = new Sections([
            new Section('root', 10, 80),
            new Section('root/foo', 20, 70),
            new Section('root/foo/bar', 30, 60)
        ]);
    });

    describe('constructor', function () {
        it('creates an empty array with no arguments', function () {
            var s = new Sections();
            s.items.should.be.empty();
        });

        it('makes a copy of an array', function () {
            var arr = [1, 2, 3];
            var s = new Sections(arr);
            s.items.should.be.eql([1, 2, 3]).and.not.equal(arr);
        });

        it('throws if not an array', function () {
            (function () {
                var s = new Sections('something');
            }).should.throw('invalid argument');
        })
    });

    describe('count', function () {
        it('returns how many items', function () {
            var s = new Sections([1, 2, 3]);
            s.count().should.be.equal(3);
        });
    });

    describe('beforeRender', function () {
        it('throws there are no sections', function () {
            (function () {
                var s = new Sections();
                s.beforeRender();
            }).should.throw('There are no sections to render.');
        });
        it('throws if there is no root', function () {
            (function () {
                var s = new Sections([new Section('root/foo')]);
                s.beforeRender();
            }).should.throw('Must define a root section.');
        });
    });

    describe('parent', function () {
        it('throws if invalid argument', function () {
            (function () {
                target.parent(null);
            }).should.throw('invalid argument');
        });
        it('throws if parent not found', function () {
            (function () {
                target.parent('root/chicken/roster');
            }).should.throw('Parent section not found: root/chicken');
        });
        it('returns the parent', function () {
            var section = target.parent('root/foo/bar');
            section.should.be.instanceOf(Section);
            section.name.should.be.equal('root/foo');
        });
    });

    describe('find', function () {
        it('returns undefined if not found', function () {
            var section = target.find('root/house');
            (typeof section).should.be.equal('undefined');
        });
        it('returns the section', function () {
            var section = target.find('root/foo');
            section.should.be.instanceOf(Section);
            section.name.should.be.equal('root/foo');
        });
    });

    describe('contains', function () {
        it('returns true if found', function () {
            target.contains('root/foo').should.be.ok();
        });
        it('returns false if not found', function () {
            target.contains('root/house').should.not.be.ok();
        });
    });

    describe('byCreationOrder', function () {
        it('returns sections in creation order', function () {
            var items = target.byCreationOrder();
            items.should.be.length(3);
            items[0].name.should.be.equal('root/foo/bar');
            items[1].name.should.be.equal('root/foo');
            items[2].name.should.be.equal('root');
        });
    });

    describe('byOrder', function () {
        it('returns sections in display order', function () {
            var items = target.byOrder();
            items.should.be.length(3);
            items[0].name.should.be.equal('root');
            items[1].name.should.be.equal('root/foo');
            items[2].name.should.be.equal('root/foo/bar');
        });
    });

    describe('append', function () {
        it('throws if section already exists', function () {
            (function () {
                target.append('root/foo');
            }).should.throw('Section already exists: root/foo');
        });
        it('adds a new section', function () {
            target.append('root/mouse');
            target.items.should.be.length(4);
            _.last(target.items).should.be.instanceOf(Section);
            _.last(target.items).name.should.be.equal('root/mouse');
        });
    });
});