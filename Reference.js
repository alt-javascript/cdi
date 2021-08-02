const Reference = class Reference {
    constructor(entry) {
        this.entry = entry;
    }
}

module.exports = function (entry){ new Reference(entry)};