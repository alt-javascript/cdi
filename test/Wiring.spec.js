const { assert } = require('chai');
const { LoggerFactory } = require('@alt-javascript/logger');
const { Application, ApplicationContext } = require('..');
const { Context, Component, Scopes } = require('../context');
const ClassA = require('./service/ClassA');
const ClassB = require('./service/ClassB');

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

describe('Wiring Specification', () => {
  it('Classes A & B exist and are autowired by default', () => {
    const context = new Context([new Component(ClassA), new Component(ClassB)]);

    const applicationContext = new ApplicationContext([context]);
    Application.run(applicationContext);
    const classA = applicationContext.get('classA');
    const classB = applicationContext.get('classB');
    assert.exists(classA, 'classA exists');
    assert.exists(classB, 'classB exists');
    assert.equal(classA, classB.classA, 'classA === classB.classA');
    assert.equal(classB, classA.classB, 'classB === classA.classB');
    // assert.notEqual(simpleClass.uuid, simpleClass2.uuid, 'simpleClass.uuid !== simpleClass2.uuid');
  });

  // it('Simple Prototype is a prototype', () => {
  //   const context = new Context([new Prototype(SimpleClass)]);
  //
  //   const applicationContext = new ApplicationContext([context]);
  //   Application.run(applicationContext);
  //   const simpleClass = applicationContext.get('simpleClass');
  //   assert.exists(simpleClass, 'simpleClass exists');
  // });
  //
  // it('ApplicationContext accepts Context array with Prototype', () => {
  //   const context = new Context([new Prototype(SimpleClass)]);
  //
  //   const applicationContext = new ApplicationContext([context]);
  //   Application.run(applicationContext);
  //
  //   const simpleClass = applicationContext.get('simpleClass');
  //   assert.exists(simpleClass, 'simpleClass exists');
  // });
  //
  // it('ApplicationContext accepts Context object with Prototype', () => {
  //   const context = new Context(new Prototype(SimpleClass));
  //
  //   const applicationContext = new ApplicationContext(context);
  //   Application.run(applicationContext);
  //
  //   const simpleClass = applicationContext.get('simpleClass');
  //   assert.exists(simpleClass, 'simpleClass exists');
  // });
  //
  // it('ApplicationContext accepts Component object with Prototype', () => {
  //   const context = new Prototype(SimpleClass);
  //
  //   const applicationContext = new ApplicationContext(context);
  //   Application.run(applicationContext);
  //
  //   const simpleClass = applicationContext.get('simpleClass');
  //   assert.exists(simpleClass, 'simpleClass exists');
  // });
  //
  // it('ApplicationContext accepts plain old object with Prototype', () => {
  //   const context = { name: 'SimpleClass', uuid: uuidv4(), scope: Scopes.PROTOTYPE };
  //
  //   const applicationContext = new ApplicationContext(context);
  //   Application.run(applicationContext);
  //
  //   const simpleClass = applicationContext.get('simpleClass');
  //   assert.exists(simpleClass, 'simpleClass exists');
  // });
  //
  // it('ApplicationContext accepts plain old object, with require with Prototype', () => {
  //   const context = { name: 'SimpleClass', require: './test/service/SimpleClass', scope: Scopes.PROTOTYPE };
  //
  //   const applicationContext = new ApplicationContext(context);
  //   Application.run(applicationContext);
  //
  //   const simpleClass = applicationContext.get('simpleClass');
  //   assert.exists(simpleClass, 'simpleClass exists');
  //   assert.exists(simpleClass.uuid, 'simpleClass.uuid exists');
  // });
  //
  // it('ApplicationContext accepts config context with Prototype', () => {
  //   const ephemeralConfig = new EphemeralConfig(
  //       {
  //         context: {
  //           SimpleClass: {
  //             require: './test/service/SimpleClass',
  //            scope: Scopes.PROTOTYPE
  //           },
  //         },
  //       },
  //   );
  //
  //   const applicationContext = new ApplicationContext();
  //   applicationContext.config = ephemeralConfig;
  //   Application.run(applicationContext);
  //
  //   const simpleClass = applicationContext.get('simpleClass');
  //   assert.exists(simpleClass, 'simpleClass exists');
  //   assert.exists(simpleClass.uuid, 'simpleClass.uuid exists');
  // });
});
