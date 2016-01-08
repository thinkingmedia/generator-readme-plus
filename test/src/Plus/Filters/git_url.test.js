load('Plus/Filters/git_url', function (filter) {
    it('injects user, repo and branch into url', function () {
        filter.should.be.an.Array().and.be.length(4);
        filter[3]('something.png', 'thinkingmedia', 'grunt-readme-plus', 'master').should.be.equal('https://github.com/thinkingmedia/grunt-readme-plus/raw/master/something.png');
    });
});