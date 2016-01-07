load('Plus/FIles/Markdown', function (/** Plus.Files.Markdown */Markdown) {

    describe('constructor', function () {
        it('sets defaults', function () {
            var m = new Markdown();
            m.title.should.be.equal('');
            (m.parent === null).should.be.True();
            (m.root === null).should.be.True();
            m.lines.should.be.an.Array().and.be.length(0);
            m.child.should.be.an.Array().and.be.length(0);
            m.depth.should.be.equal(0);
        });
        it('sets the title', function () {
            var m = new Markdown('Hello World');
            m.title.should.be.equal('Hello World');
            m.depth.should.be.equal(0);
        });
        it('strips extra # from title', function () {
            _.each(['Hello World'], ['#Hello World'], ['##Hello WOrld'], function (str) {
                (new Markdown(str)).title.should.be.equal('Hello World');
            });
        });
        it('calculates depth from # in title', function () {
            (new Markdown('Hello World')).depth.should.be.equal(0);
            (new Markdown('#Hello World')).depth.should.be.equal(1);
            (new Markdown('##Hello World')).depth.should.be.equal(2);
            (new Markdown('###Hello World')).depth.should.be.equal(3);
            (new Markdown('####Hello World')).depth.should.be.equal(4);
        });
    });

    describe('deepCopy', function () {
        it('returns a new instance of Markdown', function () {
            var m = new Markdown('##Hello World');
            m.deepCopy().should.not.be.equal(m);
        });
        it('sets the parent to null', function () {
            var m = new Markdown('Hello World');
            m.parent = new Markdown('Parent');
            (m.deepCopy().parent === null).should.be.True();
        });
        it('sets a new parent', function () {
            var m = new Markdown('Hello World');
            m.parent = new Markdown('Parent')
            var p = new Markdown('New Parent');
            (m.deepCopy(p).parent === p).should.be.True();
        });
        it('makes a copy of lines', function () {
            var m = new Markdown('Test');
            var l = ['one', 'two', 'three'];
            m.lines = l;
            var c = m.deepCopy();
            c.lines.should.be.eql(['one', 'two', 'three']).and.not.equal(l);
        });
        it('copies children', function () {
            var m = new Markdown('Test');
            var c = new Markdown('Child');
            m.child.push(c);
            var z = m.deepCopy();
            z.child.should.be.an.Array().and.be.length(1);
            z.child[0].should.be.instanceOf(Markdown);
            z.child[0].should.not.be.equal(c);
            z.child[0].title.should.be.equal('Child');
        });
    });

    describe('dropChildren', function () {
        it('removes all children', function () {
            var m = new Markdown('Test');
            m.child.push(new Markdown('Child'));
            m.dropChildren();
            m.child.should.be.an.Array().and.be.length(0);
        });
    });

    describe('getID', function () {
        it('uses the title to create an ID', function () {
            var m = new Markdown('Hello World');
            m.getID().should.be.equal('hello-world');
        });
    });

    describe('getNormalizedDepth', function () {
        it('returns the depth based upon number of parents', function () {
            var m = new Markdown();
            m.getNormalizedDepth().should.be.equal(0);
            m.parent = new Markdown();
            m.getNormalizedDepth().should.be.equal(1);
            m.parent.parent = new Markdown();
            m.getNormalizedDepth().should.be.equal(2);
            m.parent.parent.parent = new Markdown();
            m.getNormalizedDepth().should.be.equal(3);
        });
    });

    describe('getTitle', function () {
        it('returns the title as a Markdown heading', function () {
            var m = new Markdown('Hello World');
            m.getTitle().should.be.equal('#Hello World');
            m.parent = new Markdown();
            m.getTitle().should.be.equal('##Hello World');
            m.parent.parent = new Markdown();
            m.getTitle().should.be.equal('###Hello World');
        });
    });

    describe('child methods', function () {
        // comment tests for these methods
        function validParam(funcName) {
            throws('Children can only be of type Markdown', function () {
                var m = new Markdown();
                m[funcName](null);
            });
            it('adds the child', function () {
                var parent = new Markdown();
                var child = new Markdown();
                parent[funcName](child);
                (_.find(parent.child, child) === child).should.be.True();
            });
            it('sets the child\'s parent', function () {
                var parent = new Markdown();
                var child = new Markdown();
                parent[funcName](child);
                (child.parent === parent).should.be.True();
            });
            it('is chainable', function () {
                var parent = new Markdown();
                var child = new Markdown();
                var result = parent[funcName](child);
                (parent === result).should.be.True();
            });
        }

        describe('appendChild', function () {
            validParam('appendChild');
            it('adds the child to the bottom', function () {
                var parent = new Markdown();
                parent.child = [
                    new Markdown(),
                    new Markdown()
                ];
                var child = new Markdown();
                parent.appendChild(child);
                parent.child.should.be.length(3);
                parent.child[2].should.be.equal(child);
            });
        });

        describe('prependChild', function () {
            validParam('prependChild');
            it('adds the child to the top', function () {
                var parent = new Markdown();
                parent.child = [
                    new Markdown(),
                    new Markdown()
                ];
                var child = new Markdown();
                parent.prependChild(child);
                parent.child.should.be.length(3);
                parent.child[0].should.be.equal(child);
            });
        });
    });

    describe('firstChild', function () {
        it('returns the first child', function () {
            var m = new Markdown();
            var one = new Markdown();
            var two = new Markdown();
            m.child = [one, two];
            m.firstChild().should.be.equal(one);
        });
        it('returns null if empty', function () {
            var m = new Markdown();
            (m.firstChild() === null).should.be.True();
        });
    });

    describe('findByID', function () {
        it('finds a child by the ID', function () {
            var m = new Markdown('Root');
            var one = new Markdown('One');
            var two = new Markdown('Two');
            m.child = [one, two];
            m.findByID('one').should.be.equal(one);
            m.findByID('two').should.be.equal(two);
        });
        it('returns null if empty', function () {
            var m = new Markdown('Root');
            (m.findByID('three') === null).should.be.True();
        });
        it('returns null if not found', function () {
            var m = new Markdown('Root');
            var one = new Markdown('One');
            var two = new Markdown('Two');
            m.child = [one, two];
            (m.findByID('three') === null).should.be.True();
        });
    });

    describe('removeByID', function () {
        it('removes a child by the ID', function () {
            var m = new Markdown('Root');
            var one = new Markdown('One');
            var two = new Markdown('Two');
            m.child = [one, two];
            m.removeByID('one');
            m.child.should.be.an.Array().and.be.eql([two]);
        });
        it('does nothing if it does not exist', function () {
            var m = new Markdown('Root');
            var one = new Markdown('One');
            var two = new Markdown('Two');
            m.child = [one, two];
            m.removeByID('three');
            m.child.should.be.an.Array().and.be.eql([one, two]);
        });
        it('does nothing if empty', function () {
            var m = new Markdown();
            m.removeByID('one');
            m.child.should.be.an.Array().and.be.length(0);
        })
    });

    describe('trim', function () {
        it('removes empty lines', function () {
            var m = new Markdown();
            m.lines = ['', '', 'one', 'two', '', ''];
            m.trim();
            m.lines.should.be.eql(['one', 'two']);
        });
        it('does not trim indents from lines', function () {
            var m = new Markdown();
            m.lines = ['    one'];
            m.trim();
            m.lines.should.be.eql(['    one']);
        });
    });

    describe('toString', function () {
        it('converts to a string', function () {
            var m = new Markdown('Test');
            m.lines = ['one', 'two'];
            m.toString().should.be.equal('#Test\n\none\ntwo');
        });
        it('returns empty string for empty Markdown', function () {
            var m = new Markdown();
            m.toString().should.be.equal('');
        });
        it('returns just title', function () {
            var m = new Markdown('Test');
            m.toString().should.be.equal('#Test');
        });
        it('double spaces after title', function () {
            var m = new Markdown('Root');
            m.lines = ['one', 'two'];
            m.toString().should.be.equal('#Root\n\none\ntwo');
        });
        it('double spaces before child', function () {
            var m = new Markdown('Root');
            m.lines = ['one', 'two'];
            var c = new Markdown('Child');
            c.lines = ['three', 'four'];
            m.appendChild(c);
            m.toString().should.be.equal('#Root\n\none\ntwo\n\n##Child\n\nthree\nfour');
        });
        it('double spaces between child', function () {
            var m = new Markdown('Root');
            m.lines = ['one', 'two'];
            var c1 = new Markdown('Boy');
            c1.lines = ['three', 'four'];
            var c2 = new Markdown('Girl');
            c2.lines = ['five', 'six'];
            m.appendChild(c1);
            m.appendChild(c2);
            m.toString().should.be.equal('#Root\n\none\ntwo\n\n##Boy\n\nthree\nfour\n\n##Girl\n\nfive\nsix');
        });
    });

    describe('save', function () {
        throws("Must provide a filename", function () {
            var m = new Markdown('Root');
            m.save();
        });
        it('calls fs.writeFileSync', function () {
            var l = new Loader();
            var count = 0;
            l.replace('fs', {
                writeFileSync: function (name, str) {
                    name.should.be.equal('README.md');
                    str.should.be.equal('#Root');
                    count++;
                }
            });
            var target = l.resolve('Plus/Files/Markdown');
            var m = new target('Root');
            m.save('README.md');
            count.should.be.equal(1);
        });
    });

    describe('load', function () {
        it.skip('calls fs.readFileSync', function () {

        });
        it.skip('returns a Markdown object', function () {

        });
    });
});
