const {Context,Entry,Scope,Profile,Property} = require('../..');
module.exports.context = new Context(
    [
        new Entry(module.exports.AutoService),
        new Entry(module.exports.ManualService,
            'manualService',
            '@cloud-pad-min/cdi/example/service/AutoService',
            [Scope.SINGLETON],
            [
                Property('logger', {factory:'LoggerFactory',method:'getLogger',args:['@cloud-pad-min/cdi/example/service/AutoService']}),
                Property('manualService',{reference:'manualService'}),
                Property('logger',{reference:'logger'}),
                Property('someProperty',{value:'myconfigpath',default:'myDefault'}),
                Property('someEntry','someEntry'),
            ],
            [Profile('some',true)])
    ]
);

/*
    constructor() {
        this.logger = Autowire
        this.manualService = Autowire;
        this.someProperty = Value('myconfigpath');
        this.someEntry = Reference('someEntry');
    }
 */