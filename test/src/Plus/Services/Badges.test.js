load('Plus/Services/Badges', function (/** Plus.Services.Badges */Badges) {

    it('should format valid Markdown', function () {
        Badges.create('Build', 'http://github.com/images/build.png', 'http://travis.com/build.php')
            .should.be.equal('[![Build](http://github.com/images/build.png)](http://travis.com/build.php)');
    });

});