const Value = class Value {
    constructor(path,defaultValue) {
        this.path = path;
        this.default = defaultValue;
    }
}

module.exports = function (path,defaultValue){ new Value(path,defaultValue)};