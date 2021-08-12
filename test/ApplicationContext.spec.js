const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { LoggerFactory } = require('@alt-javascript/logger');
const { EphemeralConfig } = require('@alt-javascript/config');
const { v4: uuidv4 } = require('uuid');
const { ApplicationContext } = require('..');
const { Context, Component } = require('../context');
const SimpleClass = require('./service/SimpleClass');

const logger = LoggerFactory.getLogger('@alt-javascript/contexts/test/ApplicationContext_spec');
const assert = chai.assert;
chai.use(chaiAsPromised);


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

describe('ApplicationContext Specification', () => {
  it('ApplicationContext accepts nullish', async () => {
    const context = new Context();

    const applicationContext = new ApplicationContext([context]);
    await applicationContext.start();

    const config = applicationContext.get('config');
    assert.exists(config, 'config exists');
  });

  it('ApplicationContext throws nullish', async () => {

    const applicationContext = new ApplicationContext([null]);
    await assert.isRejected(applicationContext.start(), Error, "ApplicationContext (default) received a nullish context.");
  });

  it('ApplicationContext accepts nullish components', async () => {

    const applicationContext = new ApplicationContext([new Context(null)]);
    await assert.isFulfilled(applicationContext.start(), "new ApplicationContext([new Context(null)] is ok");
  });
  it('ApplicationContext fails on dupe', async () => {
    const context = new Context([new Component(SimpleClass),new Component(SimpleClass)]);

    const applicationContext = new ApplicationContext([context]);
    await assert.isRejected(applicationContext.start(), Error, "Duplicate definition of application context component (simpleClass)");
  });

  it('ApplicationContext accepts Context array', () => {
    const context = new Context([new Component(SimpleClass)]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts Context object', () => {
    const context = new Context(new Component(SimpleClass));

    const applicationContext = new ApplicationContext(context);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts Component object', () => {
    const context = new Component(SimpleClass);

    const applicationContext = new ApplicationContext(context);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts plain old class', () => {
    const context = SimpleClass;

    const applicationContext = new ApplicationContext(context);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts plain old object', () => {
    const context = { name: 'SimpleClass', uuid: uuidv4() };

    const applicationContext = new ApplicationContext(context);
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });

  it('ApplicationContext accepts plain old object, with require', () => {
    const context = { name: 'SimpleClass', require: './test/service/SimpleClass' };

    const applicationContext = new ApplicationContext(context);
    applicationContext.start();

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

    const applicationContext = new ApplicationContext({ config: ephemeralConfig });
    applicationContext.start();

    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
    assert.exists(simpleClass.uuid, 'simpleClass.uuid exists');
  });
});
