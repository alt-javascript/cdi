const { assert } = require('chai');
const { LoggerFactory } = require('@alt-javascript/logger');
const { Application, ApplicationContext } = require('..');
const { Context, Component, Singleton } = require('../context');
const SimpleClass = require('./service/SimpleClass');

const logger = LoggerFactory.getLogger('@alt-javascript/contexts/test/Singleton_spec');

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
  it('Simple Component is a singleton', () => {
    const context = new Context([new Component(SimpleClass)]);

    const applicationContext = new ApplicationContext([context]);
    Application.run(applicationContext);
    const simpleClass = applicationContext.get('simpleClass');
    const simpleClass2 = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
    assert.equal(simpleClass.uuid, simpleClass2.uuid, 'simpleClass.uuid === simpleClass2.uuid');
  });

  it('Simple Singleton is a singleton', () => {
    const context = new Context([new Singleton(SimpleClass)]);

    const applicationContext = new ApplicationContext([context]);
    Application.run(applicationContext);
    const simpleClass = applicationContext.get('simpleClass');
    assert.exists(simpleClass, 'simpleClass exists');
  });
});
