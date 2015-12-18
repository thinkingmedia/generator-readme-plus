define(['path', 'Files/Markdown', 'Files/Logger'], function (path, /** Markdown */Markdown, /** Logger */Logger) {

    /**
     * @param {Markdown} md
     * @constructor
     */
    var ReadMe = function (md) {
        if(!(md instanceof Markdown)) {
            throw Error('Parameter must be a Markdown object.');
        }
    };

    return ReadMe;
});