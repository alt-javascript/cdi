const Component = require('./Component');
const Scopes = require('./Scopes');

module.exports = class Singleton extends Component {
    constructor(reference,name,qualifier,properties,profiles) {
        super (reference,name,qualifier,Scopes.SINGLETON,properties,profiles)
    }
}
