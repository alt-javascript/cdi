const { assert } = require('chai');
const { LoggerFactory } = require('@alt-javascript/logger');
const { EphemeralConfig } = require('@alt-javascript/config');
const { v4: uuidv4 } = require('uuid');
const { Application, ApplicationContext } = require('..');
const { Context, Component } = require('../context');
const SimpleSingleton = require('./service/SimpleSingleton');

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
    const context = new Context([new Component(SimpleSingleton)]);

    const applicationContext = new ApplicationContext([context]);
    Application.run(applicationContext);

    const simpleSingleton = applicationContext.get('simpleSingleton');
    assert.exists(simpleSingleton, 'simpleSingleton exists');
  });

  it('ApplicationContext accepts Context object', () => {
    const context = new Context(new Component(SimpleSingleton));

    const applicationContext = new ApplicationContext(context);
    Application.run(applicationContext);

    const simpleSingleton = applicationContext.get('simpleSingleton');
    assert.exists(simpleSingleton, 'simpleSingleton exists');
  });

  it('ApplicationContext accepts Component object', () => {
    const context = new Component(SimpleSingleton);

    const applicationContext = new ApplicationContext(context);
    Application.run(applicationContext);

    const simpleSingleton = applicationContext.get('simpleSingleton');
    assert.exists(simpleSingleton, 'simpleSingleton exists');
  });

  it('ApplicationContext accepts plain old class', () => {
    const context = SimpleSingleton;

    const applicationContext = new ApplicationContext(context);
    Application.run(applicationContext);

    const simpleSingleton = applicationContext.get('simpleSingleton');
    assert.exists(simpleSingleton, 'simpleSingleton exists');
  });

  it('ApplicationContext accepts plain old object', () => {
    const context = { name: 'SimpleSingleton', uuid: uuidv4() };

    const applicationContext = new ApplicationContext(context);
    Application.run(applicationContext);

    const simpleSingleton = applicationContext.get('simpleSingleton');
    assert.exists(simpleSingleton, 'simpleSingleton exists');
  });

  it('ApplicationContext accepts plain old object, with require', () => {
    const context = { name: 'SimpleSingleton', require: './test/service/SimpleSingleton' };

    const applicationContext = new ApplicationContext(context);
    Application.run(applicationContext);

    const simpleSingleton = applicationContext.get('simpleSingleton');
    assert.exists(simpleSingleton, 'simpleSingleton exists');
    assert.exists(simpleSingleton.uuid, 'simpleSingleton.uuid exists');
  });

  it('ApplicationContext accepts config context', () => {
    const ephemeralConfig = new EphemeralConfig(
      {
        context: {
          SimpleSingleton: {
            require: './test/service/SimpleSingleton',
          },
        },
      },
    );

    const applicationContext = new ApplicationContext();
    applicationContext.config = ephemeralConfig;
    Application.run(applicationContext);

    const simpleSingleton = applicationContext.get('simpleSingleton');
    assert.exists(simpleSingleton, 'simpleSingleton exists');
    assert.exists(simpleSingleton.uuid, 'simpleSingleton.uuid exists');

  });
});
