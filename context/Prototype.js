const Component = require('./Component');
const Scopes = require('./Scopes');

module.exports = class Prototype extends Component {
    constructor(reference,name,qualifier,properties,profiles) {
        super (reference,name,qualifier,Scopes.PROTOTYPE,properties,profiles)
    }
}
