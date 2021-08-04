const { assert } = require('chai');
const { LoggerFactory } = require('@alt-javascript/logger');
const { Application, ApplicationContext } = require('..');
const { Context, Component } = require('../context');
const SimpleSingleton = require('./service/SimpleSingleton');

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
  it('Simple Singleton is a singleton', () => {
    const context = new Context([new Component(SimpleSingleton)]);

    const applicationContext = new ApplicationContext([context]);
    Application.run(applicationContext);
    const simpleSingleton = applicationContext.get('simpleSingleton');
    const simpleSingleton2 = applicationContext.get('simpleSingleton');
    assert.exists(simpleSingleton, 'simpleSingleton exists');
    assert.equal(simpleSingleton.uuid, simpleSingleton2.uuid, 'simpleSingleton.uuid === simpleSingleton2.uuid');
  });

  it('Simple Singleton is a singleton', () => {
    const context = new Context([new Component(SimpleSingleton)]);

    const applicationContext = new ApplicationContext([context]);
    Application.run(applicationContext);
    const simpleSingleton = applicationContext.get('simpleSingleton');
    assert.exists(simpleSingleton, 'simpleSingleton exists');
  });
});
