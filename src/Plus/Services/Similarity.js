/**
 * @param _
 * @returns {Plus.Services.Similarity}
 */
function Module(_) {

    /**
     * @name Plus.Services.Similarity
     * @constructor
     */
    var Similarity = function () {

    };

    /**
     * @param {string} str
     * @returns {Object.<string,number>}
     * @private
     */
    Similarity.prototype._termFreqMap = function (str) {
        var words = str.split(' ');
        var termFreq = {};
        _.each(words, function (w) {
            termFreq[w] = (termFreq[w] || 0) + 1;
        });
        return termFreq;
    };

    /**
     * @param {Object.<string,number>} map
     * @param {Object.<string,boolean>} dict
     * @private
     */
    Similarity.prototype._addKeysToDict = function (map, dict) {
        _.each(map, function (value, key) {
            dict[key] = true;
        });
    };

    /**
     * @param {Object.<string,number>} map
     * @param {Object.<string,boolean>} dict
     * @returns {Array.<number>}
     * @private
     */
    Similarity.prototype._termFreqMapToVector = function (map, dict) {
        var termFreqVector = [];
        _.each(dict, function (value, key) {
            termFreqVector.push(map[key] || 0);
        });
        return termFreqVector;
    };

    /**
     * @param {Array.<number>} vecA
     * @param {Array.<number>} vecB
     * @returns {number}
     * @private
     */
    Similarity.prototype._vecDotProduct = function (vecA, vecB) {
        var product = 0;
        for (var i = 0; i < vecA.length; i++) {
            product += vecA[i] * vecB[i];
        }
        return product;
    };

    /**
     * @param {Array.<number>} vec
     * @returns {number}
     * @private
     */
    Similarity.prototype._vecMagnitude = function (vec) {
        var sum = 0;
        for (var i = 0; i < vec.length; i++) {
            sum += vec[i] * vec[i];
        }
        return Math.sqrt(sum);
    };

    /**
     * @param {Array.<number>} vecA
     * @param {Array.<number>} vecB
     * @returns {number}
     * @private
     */
    Similarity.prototype._cosineSimilarity = function (vecA, vecB) {
        return this._vecDotProduct(vecA, vecB) / (this._vecMagnitude(vecA) * this._vecMagnitude(vecB));
    };

    /**
     * @param {string} strA
     * @param {string} strB
     * @returns {number}
     */
    Similarity.prototype.similarity = function (strA, strB) {
        var termFreqA = this._termFreqMap(strA);
        var termFreqB = this._termFreqMap(strB);

        var dict = {};
        this._addKeysToDict(termFreqA, dict);
        this._addKeysToDict(termFreqB, dict);

        var termFreqVecA = this._termFreqMapToVector(termFreqA, dict);
        var termFreqVecB = this._termFreqMapToVector(termFreqB, dict);

        return this._cosineSimilarity(termFreqVecA, termFreqVecB);
    };

    return new Similarity();
}

module.exports = [
    'lodash',
    Module
];