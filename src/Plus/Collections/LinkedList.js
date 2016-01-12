/**
 * @returns {Plus.Collections.LinkedList}
 */
function Module() {
    /**
     * @name Plus.Collections.LinkedList
     *
     * @template T
     * @constructor
     */
    var LinkedList = function () {
        /**
         * @type {LinkedList.Node<T>|null}
         */
        this.first = null;
        /**
         * @type {LinkedList.Node<T>|null}
         */
        this.last = null;

        /**
         * @type {number}
         */
        this.count = 0;
    };

    /**
     * @param {T} value
     * @template T
     * @constructor
     */
    LinkedList.Node = function (value) {
        /**
         * @type {T}
         */
        this.value = value;
        /**
         * @type {LinkedList.Node<T>|null}
         */
        this.prev = null;
        /**
         * @type {LinkedList.Node<T>|null}
         */
        this.next = null;
    };

    /**
     * Clears the contents.
     */
    LinkedList.prototype.clear = function () {
        this.first = this.last = null;
        this.count = 0;
    };

    /**
     * @param {T} value
     * @returns {LinkedList.Node<T>}
     */
    LinkedList.prototype.push = function (value) {
        var node = new LinkedList.Node(value);

        if (this.first == null) {
            this.first = this.last = node;
        } else {
            this.last.next = node;
            node.prev = this.last;
            this.last = node;
        }

        this.count++;
        return node;
    };

    /**
     * @returns {LinkedList.Node<T>[]}
     */
    LinkedList.prototype.toArray = function () {
        var items = [];
        var node = this.first;
        while (node) {
            items.push(node);
            node = node.next;
        }
        return items;
    };

    return LinkedList;
}

module.exports = [
    Module
];