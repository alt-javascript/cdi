const { assert } = require('chai');
const { LoggerFactory } = require('@alt-javascript/logger');
const { EphemeralConfig } = require('@alt-javascript/config');
const { v4: uuidv4 } = require('uuid');
const { ApplicationContext } = require('..');
const { Context, Prototype, Transient, Scopes } = require('../context');
const SimpleClass = require('./service/SimpleClass');

const logger = LoggerFactory.getLogger('@alt-javascript/cdi/test/Prototype_spec');

before(async () => {
  logger.verbose('before spec setup started');
  // ..
  logger.verbose('before spec setup completed');
});

beforeEach(async () => {
  logger.verbose('before each setup started');
  // ..
  logger.verbose('before each setup completed');
});

after(async () => {
  logger.verbose('after teardown started');
  // ...
  logger.verbose('after teardown completed');
});

beforeEach(async () => {
  logger.verbose('before each setup started');
  // ..
  logger.verbose('before each setup completed');
});

describe('Prototypes Specification', () => {
  it('Simple Prototype is a prototype', () => {
    const context = new Context([new Prototype(SimpleClass)]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    const simpleClass2 = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
    assert.notEqual(simpleClass.uuid, simpleClass2.uuid, 'simpleClass.uuid !== simpleClass2.uuid');
  });

  it('Simple Prototype exists', () => {
    const context = new Context([new Prototype(SimpleClass)]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts Context object with Prototype', () => {
    const context = new Context(new Prototype(SimpleClass));

    const applicationContext = new ApplicationContext(context);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts Component object with Prototype', () => {
    const context = new Prototype(SimpleClass);

    const applicationContext = new ApplicationContext(context);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts Component object with Prototype with Reference', () => {
    const context = new Prototype({ Reference: SimpleClass });

    const applicationContext = new ApplicationContext(context);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts plain old object with Prototype', () => {
    const context = { name: 'SimpleClass', uuid: uuidv4(), scope: Scopes.PROTOTYPE };

    const applicationContext = new ApplicationContext(context);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts plain old object, with require with Prototype', () => {
    const context = { name: 'SimpleClass', require: './test/service/SimpleClass', scope: Scopes.PROTOTYPE };

    const applicationContext = new ApplicationContext(context);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
    assert.exists(simpleClass.uuid, 'simpleClass.uuid exists');
  });

  it('ApplicationContext accepts config context with Prototype', () => {
    const ephemeralConfig = new EphemeralConfig(
      {
        context: {
          SimpleClass: {
            require: './test/service/SimpleClass',
            scope: Scopes.PROTOTYPE,
          },
        },
      },
    );

    const applicationContext = new ApplicationContext();
    applicationContext.config = ephemeralConfig;
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
    assert.exists(simpleClass.uuid, 'simpleClass.uuid exists');
  });

  it('Simple Prototype using Reference function', () => {
    const context = new Context([new Prototype({
      name: 'funcy',
      Reference: () => ({ attr: 'value' }),
    })]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();
    const funcy = applicationContext.get('funcy');
    assert.exists(funcy, 'funcy exists');
    assert.equal(funcy.attr, 'value', 'funcy.attr == value');
  });

  it('Simple Prototype using factory function', () => {
    const context = new Context([new Transient({
      name: 'funcy',
      factory: () => ({ attr: 'value' }),
      factoryArgs: 'one',
    })]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();
    const funcy = applicationContext.get('funcy');
    assert.exists(funcy, 'funcy exists');
    assert.equal(funcy.attr, 'value', 'funcy.attr == value');
  });

  it('Simple Prototype using singleton factory function', () => {
    const context = new Context([
      {
        name: 'singletonFactory',
        generator: (param) => ({ name: 'simplePrototype', attr: param }),
      },
      new Prototype({
        name: 'factoryProto',
        factory: 'singletonFactory',
        factoryFunction: 'generator',
        factoryArgs: 'one',
      })]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();
    const factoryProto = applicationContext.get('factoryProto');
    assert.exists(factoryProto, 'factoryProto exists');
    assert.equal(factoryProto.attr, 'one', 'factoryProto.attr == one');
  });

  it('Simple Singleton wires logger prototype with wireFactory', () => {
    const context = new Context(
      {
        name: 'simpleSingleton',
        qualifier: '@alt-javascript/cdi/SimpleSingleton',
        logger: null,
      },
    );

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();
    const simpleSingleton = applicationContext.get('simpleSingleton');
    assert.exists(simpleSingleton, 'simpleSingleton exists');
    assert.exists(simpleSingleton.logger, 'simpleSingleton.logger exists');
    assert.equal(simpleSingleton.logger.category, simpleSingleton.qualifier, 'simpleSingleton.logger.category == simpleSingleton.qualifier');
  });
});
