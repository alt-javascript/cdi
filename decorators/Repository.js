const Repository = class Repository {
    constructor(name) {
        this.name = name;
    }
}
module.exports = function (name){ new Repository(name)};