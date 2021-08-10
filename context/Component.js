module.exports = class Component {
    constructor(options) {
        //reference,name,qualifier,scope,properties,profiles
        this.Reference = options?.Reference || options;
        this.name = options?.name;
        this.qualifier = options?.qualifier;
        this.scope = options?.scope;
        this.properties = options?.properties;
        this.profiles = options?.profiles;
        this.isActive = true;
        this.instance = null;

        this.isClass = false;
        this.require = null;
    }
}
