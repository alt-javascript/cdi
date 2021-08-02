const Qualifier  = class Qualifier {
    constructor(name) {
        this.name = name;
    }
}
module.exports = function (name) { return new Qualifier(name);}