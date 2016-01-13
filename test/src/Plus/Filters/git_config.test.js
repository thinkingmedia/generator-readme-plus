filter('git:config', function () {

    var shell = {
        has: function () {
            return this;
        },
        exec: function () {
            return "user.email=support@thinkingmedia.ca\r\nuser.name=thinkingmedia";
        }
    };

    filter.apply({test: 'value'}, 'returns default value', function (value) {
        value.should.be.eql({test: 'value'});
    });

    mock('Plus/Services/Shell', shell, function () {
        filter.apply(undefined, 'returns the branch', function (value) {
            value.should.be.eql({
                'user.email': 'support@thinkingmedia.ca',
                'user.name': 'thinkingmedia'
            });
        });
    });
});