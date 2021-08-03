const {Context,Component, Scopes, Property} = require('../../context');
module.exports.ManualService = require('./ManualService');
module.exports.AutoService = require('./AutoService');
module.exports.context = new Context(
    [
        new Component(module.exports.AutoService),
        new Component(module.exports.ManualService,
            'manualService',
            '@cloud-pad-min/cdi/example/service/ManualService',
            Scopes.SINGLETON,
            [
                Property('logger', {factory:'LoggerFactory',method:'getLogger',args:['@cloud-pad-min/cdi/example/service/AutoService']}),
                Property('manualService',{reference:'manualService'}),
                Property('logger',{reference:'logger'}),
                Property('someProperty',{value:'myconfigpath',default:'myDefault'}),
                Property('someEntry','someEntry'),
            ])
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
