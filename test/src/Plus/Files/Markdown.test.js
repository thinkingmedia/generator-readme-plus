describe('Markdown', function () {
    describe('constructor', function () {
        it.skip('supports defaults', function () {

        });
        it.skip('sets the title', function () {

        });
        it.skip('strips extra # from title', function () {

        });
        it.skip('calculates depth from # in title', function () {

        });
    });

    describe('clone', function () {
        it.skip('makes a deep copy', function () {

        });
    });

    describe('dropChildren', function () {
        it.skip('removes all children', function () {

        });
    });

    describe('getID', function () {
        it.skip('uses the title to create an ID', function () {

        });
    });

    describe('getNormalizedDepth', function () {
        it.skip('returns the depth based upon number of parents', function () {

        });
    });

    describe('getTitle', function () {
        it.skip('returns the title as a Markdown heading', function () {

        });
    });

    describe('child methods', function () {
        function validParam() {
            it.skip('requires a Markdown parameter', function () {

            });
            it.skip('sets the child\'s parent', function () {

            });
            it.skip('is chainable', function () {

            });
        }

        describe('appendChild', function () {
            validParam();
            it.skip('adds the child to the bottom', function () {

            });
        });

        describe('prependChild', function () {
            validParam();
            it.skip('adds the child to the bottom', function () {

            });
        });

        describe('insertChild', function () {
            validParam();
            it.skip('adds the child at an offset', function () {

            });
        });
    });

    describe('firstChild', function () {
        it.skip('returns the first child', function () {

        });
        it.skip('returns null if empty', function () {

        });
    });

    describe('findByID', function () {
        it.skip('finds a child by the ID', function () {

        });
    });

    describe('removeByID', function () {
        it.skip('removes a child by the ID', function () {

        });
    });

    describe('trim', function () {
        it.skip('removes empty lines', function () {

        });
    });

    describe('toString', function () {
        it.skip('converts to a string', function () {

        });
        it.skip('returns empty string for empty Markdown', function () {

        });
        it.skip('also converts children', function () {

        });
    });

    describe('save', function () {
        it.skip('calls fs.writeFileSync', function () {

        });
    });

    describe('load', function () {
        it.skip('calls fs.readFileSync', function () {

        });
        it.skip('returns a Markdown object', function () {

        });
    });
});
