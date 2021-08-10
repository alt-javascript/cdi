const Component = require('./Component');
const Scopes = require('./Scopes');

module.exports = class Singleton extends Component {
    constructor(optionsArg) {
        let options = optionsArg.Reference ? optionsArg : {Reference: optionsArg}
        options.scope = Scopes.PROTOTYPE;
        super (options);
    }
}
