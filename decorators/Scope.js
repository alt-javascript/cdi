const Scope = class Scope {
    constructor(value) {
        this.value = value;
    }
}
module.exports = function (value){ new Scope(value)};
