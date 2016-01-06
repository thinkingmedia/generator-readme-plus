load('Plus/Services/Git', function(/** Plus.Services.Git */Git) {

    describe.skip('constructor', function(){
        throws('git command line tool was not found.', function(){

        });
        throws('"remote.origin.url" is missing from Git info.', function(){

        });
        it('reads Git config options', function(){

        });
    });

    describe.skip('getInfo', function(){
        it('returns info about working branch', function(){

        });
    });
});