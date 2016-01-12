/**
 * @param {string} message
 * @param {function} callback
 * @param {function|string} input
 * @param {function(string,string,number)=} verify
 */
module.exports = function (message, callback, input, verify) {
    it('reads ' + message, function () {

        callback.should.be.a.Function();
        if (verify) {
            verify.should.be.a.Function();
        }

        var self = this;
        self.count = 0;
        var l = new Loader();
        l.replace('fs', {
            readFileSync: function (name, type) {
                self.name = name;
                self.type = type;
                self.count++;
                return _.isFunction(input) ? input() : input;
            }
        });

        callback.call(this, l);
        self.count.should.be.equal(1, 'fs.readFileSync was not called');
        verify && verify(self.name, self.type, self.count);
    });
};

/**
 * @param {string} message
 * @param {function} callback
 */
module.exports.skip = function (message, callback) {
    it.skip('reads ' + message, _.noop);
};
