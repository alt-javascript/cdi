const { Autowired,Resource,Service,Scope,Profile,Qualifier,Value} = require('../../decorators');

module.exports = class AutoService {
    static is = Service ('myService');
    static with = [Scope(Scope.SINGLETON),Profile('test'),Qualifier('@cloud-pad-min/cdi/example/service/AutoService')]
    static qualifier = '@cloud-pad-min/cdi/example/service/AutoService';
    static scope = Scope.SINGLETON;
    static profile = Profile('asd,iuyiuy,jhjh',true);

    constructor() {
        this.logger = Autowired;
        this.manualService = Autowired;
        this.someProperty = Value('myconfigpath','myDefault');
        this.someEntry = Resource('someEntry');
    }
}