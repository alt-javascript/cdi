module.exports = class Component {
    constructor(reference,name,qualifier,scope,properties,profiles) {
        this.Reference = reference;
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
