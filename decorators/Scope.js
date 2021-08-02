const Scopes = require('../context/Scopes');

const Scope = class Scope {
    static SINGLETON = Scopes.SINGLETON;
    static PROTOTYPE = Scopes.PROTOTYPE;
    constructor(value) {
        this.value = value;
    }
}
module.exports = function (value){ new Scope(value)};