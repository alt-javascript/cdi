const { assert } = require('chai');
const { LoggerFactory } = require('@alt-javascript/logger');
const { Application, ApplicationContext } = require('..');
const { context } = require('./service');

const logger = LoggerFactory.getLogger('@alt-javascript/contexts/test/contexts_spec');

logger.info('Starting application context');
const applicationContext = new ApplicationContext([context]);
Application.run(applicationContext);

logger.info('Application context started');

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

describe('contexts Specification', () => {
  it('true is true', () => {
    assert.isTrue(true, 'true is true');
  });
});
