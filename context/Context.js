const _ = require('lodash');
module.exports = class Context {
    constructor(components,profile) {
        this.components = (_.isArray(components) ? components : [components]) || [];
        this.profile = profile;
    }
}
