define(['q','github','Services/Git'], function(Q, GitHubApi, /** Git */Git){

    /**
     * @name Plus.GitHub
     *
     * @constructor
     */
    var GitHub = function () {
        // @todo - handle this better
        this.info = Git.getInfo();
        if (!this.info) {
            throw Error('Git information required.');
        }

        this.api = new GitHubApi({
            'version': '3.0.0',
            'protocol': 'https',
            'headers': {
                'user-agent': 'thinkingmedia/generator-readme-plus'
            }
        });
    };

    /**
     * @returns {promise}
     */
    GitHub.prototype.getInfo = function () {

        // @todo - can this be cached on disk?
        if (!this.promise) {
            var defer = Q.defer();
            this.api.repos.get({
                'user': this.info.user,
                'repo': this.info.repo
            }, function (err, res) {
                if (err) {
                    defer.reject(err);
                    return;
                }
                defer.resolve({
                    url: res.homepage,
                    desc: res.description
                });
            });
            this.promise = defer.promise;
        }

        return this.promise;
    };

    return new GitHub();
});
