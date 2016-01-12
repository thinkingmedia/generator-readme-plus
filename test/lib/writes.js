var _ = require('lodash');
var Loader = require('../../src/Plus/Loader');

/**
 * @param {string} message
 * @param {function} callback
 * @param {function(string,*,string,number)} verify
 */
module.exports = function (message, callback, verify) {
    it('writes ' + message, function () {
        callback.should.be.a.Function();
        verify.should.be.a.Function();

        var self = this;
        self.count = 0;
        var l = new Loader();
        l.replace('fs', {
            writeFileSync: function (name, value, type) {
                self.name = name;
                self.output = value;
                self.type = type;
                self.count++;
            }
        });

        callback.call(this, l);
        self.count.should.be.equal(1, 'fs.writeFileSync was not called');
        verify(self.name, self.output, self.type, self.count);
    });
};

/**
 * @param {string} message
 * @param {Function=} callback
 */
module.exports.skip = function (message, callback) {
    it.skip('writes ' + message, _.noop);
};
