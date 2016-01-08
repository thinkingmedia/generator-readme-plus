function Module() {

    /**
     * @name Plus.Services.Cache
     *
     * @param {string} name
     *
     * @constructor
     */
    var Cache = function (name) {
        this._name = name;
    };

    return Cache;
}

module.exports = [
    Module
];