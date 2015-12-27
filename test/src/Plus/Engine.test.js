/**
 * @type Plus.Engine
 */
var Engine = requirejs('Plus/Engine');

describe('Engine', function () {
    describe('#constructor',function(){
        it('requires sections to render', function () {
            var engine = new Engine();
            assert.throws(engine.render, Error, "There are no sections to render");
        });
        it('requires filters to render', function(){
            var engine = new Engine();
            engine.add_section('root/test');
            assert.throws(engine.render, Error, "There are no filters to render");
        });
    });
});
