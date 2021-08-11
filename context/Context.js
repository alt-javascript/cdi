const _ = require('lodash');
module.exports = class Context {
    constructor(components,profile) {
        this.components = (components || []) ;
        this.components = (_.isArray(this.components) ? this.components : [this.components]) ;
        this.profile = profile;
    }
}
