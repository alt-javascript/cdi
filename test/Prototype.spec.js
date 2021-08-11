const { assert } = require('chai');
const { LoggerFactory } = require('@alt-javascript/logger');
const { EphemeralConfig } = require('@alt-javascript/config');
const { v4: uuidv4 } = require('uuid');
const { ApplicationContext } = require('..');
const { Context, Prototype, Scopes } = require('../context');
const SimpleClass = require('./service/SimpleClass');

const logger = LoggerFactory.getLogger('@alt-javascript/contexts/test/Prototype_spec');

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
    const context = new Prototype({Reference: SimpleClass});

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
});
