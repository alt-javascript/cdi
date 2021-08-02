const Resource = class Resource { //name/type/qualifier
    constructor(name) {
        this.name = name;
    }
}
module.exports = function (name){ new Resource(name)};