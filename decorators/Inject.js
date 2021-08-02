const Inject = class Inject { //type/qualifier/name
    constructor(name) {
        this.name = name;
    }
}
module.exports = function (name){ new Inject(name)};