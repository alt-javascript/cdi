const Property = class Property {
    constructor(options) {
        this.name = options?.name;
        this.reference = options?.ref || options?.reference;
        this.value = options?.value;
        this.defaultValue = options?.defaultValue;
    }
}

module.exports = function (options){ new Property(options)};
