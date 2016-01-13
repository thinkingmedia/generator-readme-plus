filter('git:branch', function () {

    apply('something', 'returns that value', function (value) {
        //value.should.be.equal('something');
    });

    //apply('', function (value) {
    //    value.should.be.equal('trunk');
    //});
});