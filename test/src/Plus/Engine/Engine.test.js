return;
describe('Engine', function () {
    describe('#constructor',function(){
        var engine;
        before(function(){
            console.log('xx');
            engine = new Engine();
        });
        it('requires sections to render', function () {
            assert.throws(engine.render, "There are no sections to render.");
        });
        it('requires filters to render', function(){
            engine.add_section('root/test');
            assert.throws(engine.render, "There are no filters to render");
        });
    });
});
