filter('git:branch', function () {

    var shell = {
        has: function () {
            return this;
        },
        exec: function () {
            return 'turkey';
        }
    };

    filter.apply('something', 'returns default value', function (value) {
        value.should.be.equal('something');
    });

    mock('Plus/Services/Shell', shell, function () {
        filter.apply('', 'returns the branch', function (value) {
            value.should.be.equal('turkey');
        });
    });
});