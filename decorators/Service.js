const Service = class Service {
    constructor(name) {
        this.name = name;
    }
}
module.exports = function (name){ new Service(name)};