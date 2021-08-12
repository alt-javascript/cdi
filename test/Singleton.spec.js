const { assert } = require('chai');
const { LoggerFactory } = require('@alt-javascript/logger');
const { ApplicationContext } = require('..');
const {
  Context, Component, Singleton, Service
} = require('../context');
const SimpleClass = require('./service/SimpleClass');

const logger = LoggerFactory.getLogger('@alt-javascript/cdi/test/Singleton_spec');

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

describe('Singleton Specification', () => {
  it('Simple Component is a singleton', () => {
    const context = new Context([new Component(SimpleClass)]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();
    const simpleClass = applicationContext.get('simpleClass');
    const simpleClass2 = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
    assert.equal(simpleClass.uuid, simpleClass2.uuid, 'simpleClass.uuid === simpleClass2.uuid');
  });

  it('Simple Singleton is a singleton', () => {
    const context = new Context([new Service(SimpleClass)]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();
    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });
  it('Simple Singleton is a singleton using Reference', () => {
    const context = new Context([new Singleton({ Reference: SimpleClass })]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();
    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });
});
