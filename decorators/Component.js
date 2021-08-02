const Component = class Component {
    constructor(name) {
        this.name = name;
    }
}
module.exports = function (name){ new Component(name)};