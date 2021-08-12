const Component = require('./Component');
const Scopes = require('./Scopes');

module.exports = class Transient extends Component {
    constructor(optionsArg) {
        let options = (optionsArg?.Reference
            || optionsArg.factory
            || optionsArg.wireFactory) ? optionsArg : {Reference: optionsArg};
        options.scope = Scopes.PROTOTYPE;
        super (options);
    }
}
