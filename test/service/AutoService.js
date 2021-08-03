const { Autowired,Resource,Service,Scope,Profile,Qualifier,Value} = require('../../decorators');
const { Scopes} = require('../../context');

module.exports = class AutoService {
    static is = Service ('myService');
    static with = [Scope(Scopes.SINGLETON),Profile('test'),Qualifier('@alt-javascript/contexts/example/service/AutoService')]
    static qualifier = '@cloud-pad-min/cdi/example/service/AutoService';
    static scope = Scopes.SINGLETON;
    static profile = Profile('asd,iuyiuy,jhjh',true);

    constructor() {
        this.logger = Autowired;
        this.manualService = Autowired;
        this.someProperty = Value('myconfigpath','myDefault');
        this.someEntry = Resource('someEntry');
    }
}
