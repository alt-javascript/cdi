const { assert } = require('chai');
const { LoggerFactory } = require('@alt-javascript/logger');
const { EphemeralConfig } = require('@alt-javascript/config');
const { v4: uuidv4 } = require('uuid');
const { Application, ApplicationContext } = require('..');
const { Context, Component } = require('../context');
const SimpleClass = require('./service/SimpleClass');

const logger = LoggerFactory.getLogger('@alt-javascript/contexts/test/ApplicationContext_spec');

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

describe('Singletons Specification', () => {
  it('ApplicationContext accepts Context array', () => {
    const context = new Context([new Component(SimpleClass)]);

    const applicationContext = Application.run([context]);

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts Context object', () => {
    const context = new Context(new Component(SimpleClass));

    const applicationContext = Application.run(context);

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts Component object', () => {
    const context = new Component(SimpleClass);

    const applicationContext = Application.run(context);

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts plain old class', () => {
    const context = SimpleClass;

    const applicationContext = Application.run(context);

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts plain old object', () => {
    const context = { name: 'SimpleClass', uuid: uuidv4() };

    const applicationContext = Application.run(context);

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts plain old object, with require', () => {
    const context = { name: 'SimpleClass', require: './test/service/SimpleClass' };

    const applicationContext = Application.run(context);

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
    assert.exists(simpleClass.uuid, 'simpleClass.uuid exists');
  });

  it('ApplicationContext accepts config context', () => {
    const ephemeralConfig = new EphemeralConfig(
      {
        context: {
          SimpleClass: {
            require: './test/service/SimpleClass',
          },
        },
      },
    );

    const applicationContext = Application.run({ config: ephemeralConfig });

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
    assert.exists(simpleClass.uuid, 'simpleClass.uuid exists');
  });
});
