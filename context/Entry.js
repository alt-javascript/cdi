module.exports = class Entry {
    constructor(reference,name,qualifier,scope,properties,profiles) {
        this.reference = reference;
        this.isClass = false;
        this.name = name;
        this.qualifier = qualifier;
        this.scope = scope;
        this.properties = properties;
        this.profiles = profiles;
        this.isActive = true;
        this.instance = null;
    }
}