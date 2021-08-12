const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { EphemeralConfig } = require('@alt-javascript/config');
const { LoggerFactory } = require('@alt-javascript/logger');
const { ApplicationContext } = require('..');
const { Context, Component, Property } = require('../context');
const ClassA = require('./service/ClassA');
const ClassB = require('./service/ClassB');
const ClassC = require('./service/ClassC');
const SimpleConfigProperty = require('./service/SimpleConfigProperty');

const logger = LoggerFactory.getLogger('@alt-javascript/cdi/test/Wiring_spec');
const { assert } = chai;
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

describe('Wiring Specification', () => {
  it('Classes A & B exist and are autowired by default', () => {
    const context = new Context([
      new Component(ClassA),
      new Component(ClassB),
      new Component(ClassC)]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();
    const classA = applicationContext.get('classA');
    const classB = applicationContext.get('classB');
    const classC = applicationContext.get('classC');
    assert.exists(classA, 'classA exists');
    assert.exists(classB, 'classB exists');
    assert.equal(classA, classB.classA, 'classA === classB.classA');
    assert.equal(classB, classA.classB, 'classB === classA.classB');
    assert.equal(classB, classC.classB, 'classB === classC.classB');
    assert.isNull(classA.attribute, 'classA.attribute is null');
    assert.isNull(classB.attribute, 'classB.attribute is null');
    assert.isNull(classC.attribute, 'classC.attribute is null');
  });

  it('SimpleConfigProperty is autowired from config by default', () => {
    const ephemeralConfig = new EphemeralConfig(
      {
        pathtovalue: 1,
        context: {
          SimpleConfigProperty: {
            require: './test/service/SimpleConfigProperty',
          },
        },
      },
    );

    const applicationContext = new ApplicationContext({ config: ephemeralConfig });
    applicationContext.start();

    const simpleConfigProperty = applicationContext.get('simpleConfigProperty');
    assert.exists(simpleConfigProperty, 'simpleConfigProperty exists');
    assert.exists(simpleConfigProperty.attribute, 'simpleClass.attribute exists');
    assert.equal(simpleConfigProperty.attribute, 1, 'simpleClass.attribute == 1');
  });

  it('SimpleConfigProperty is wired from context Property definition', () => {
    const context = new Context([new Component({
      Reference: SimpleConfigProperty,
      properties: [new Property({ name: 'attribute', value: 3 })],
    })]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();

    const simpleConfigProperty = applicationContext.get('simpleConfigProperty');
    assert.exists(simpleConfigProperty, 'simpleConfigProperty exists');
    assert.exists(simpleConfigProperty.attribute, 'simpleClass.attribute exists');
    assert.equal(simpleConfigProperty.attribute, 3, 'simpleClass.attribute == 3');
  });

  it('SimpleConfigProperty is wired from context property object', () => {
    const context = new Context([new Component({
      Reference: SimpleConfigProperty,
      properties: [{ name: 'attribute', value: 3 }],
    })]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();

    const simpleConfigProperty = applicationContext.get('simpleConfigProperty');
    assert.exists(simpleConfigProperty, 'simpleConfigProperty exists');
    assert.exists(simpleConfigProperty.attribute, 'simpleClass.attribute exists');
    assert.equal(simpleConfigProperty.attribute, 3, 'simpleClass.attribute == 3');
  });

  it('ApplicationContext throws nullish', async () => {
    // eslint-disable-next-line no-template-curly-in-string
    const applicationContext = new ApplicationContext({ name: 'aSingleton', attr: '${invalidpath}' });
    await assert.isRejected(
      applicationContext.start(),
      Error,
      'Failed to explicitly autowired placeholder component (aSingleton) property value (attr) from config.',
    );
  });
});
