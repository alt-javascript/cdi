const {
  Context, Component, Scopes, Profile, Property,
} = require('../../context');

module.exports.context = new Context(
  [
    new Component(module.exports.AutoService),
    new Component(module.exports.ManualService,
      'manualService',
      '@alt-javascript/contexts/example/service/ManualService',
      Scopes.SINGLETON,
      [
        Property('logger', { factory: 'LoggerFactory', method: 'getLogger', args: ['@alt-javascript/contexts/example/service/ManualService'] }),
        Property('autoService', { reference: 'autoService' }),
        Property('someProperty', { value: 'myconfigpath', default: 'myDefault' }),
        Property('someEntry', 'someEntry'),
      ],
      Profile('some', true)),
  ],
);

/*
    constructor() {
        this.logger = Autowire
        this.manualService = Autowire;
        this.someProperty = Value('myconfigpath');
        this.someEntry = Reference('someEntry');
    }
 */
