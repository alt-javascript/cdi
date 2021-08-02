const Autowired = class Autowired {
    constructor(name) {
        this.name = name;
    }
}
module.exports = function (name){ new Autowired(name)};