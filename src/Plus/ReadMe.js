define(['path', 'Files/Markdown', 'Files/Logger'], function (path, Markdown, Logger) {

    /**
     * @param {string} inFile
     * @constructor
     */
    var ReadMe = function (inFile) {
        Logger.debug('Loading: ' + inFile);
        this.md = Markdown.load(inFile);
    };

    /**
     * @param {string} outFile
     */
    ReadMe.prototype.save = function (outFile) {
        Logger.debug('Saving: ' + outFile);
        this.md.save(outFile);
    };

    return ReadMe;
});