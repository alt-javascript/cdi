Application Contexts and Dependency Injection
=============================================================

[![NPM](https://nodei.co/npm/@alt-javascript/cdi.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/@alt-javascript/cdi/)
<br/>
![Language Badge](https://img.shields.io/github/languages/top/alt-javascript/cdi)
![Package Badge](https://img.shields.io/npm/v/@alt-javascript/cdi) <br/>
[release notes](https://github.com/alt-javascript/cdi/blob/main/History.md)

<a name="intro">Introduction</a>
--------------------------------

A familiar application context and dependency injection package for JavaScript, supporting simple
singleton and prototype component factory definitions, with a choice of manual or auto
wiring (injection) of property references and config placeholders.

<a name="usage">Usage</a>
--------------------------------

### Singleton Components

To configure a simple singleton service object, simply instantiate an `ApplicationContext` and pass it
the class definition. The default scope is `singleton`, and the component name defaults to lowerCamelCase
of the class name.

```javascript
import { ApplicationContext } from '@alt-javascript/cdi';
import { SimpleClass } from'./index.js';

const applicationContext = new ApplicationContext(SimpleClass);
applicationContext.start();
applicationContext.get('simpleClass');
```
Simple types, objects and functions can be registered as components.

```javascript
import { ApplicationContext } from '@alt-javascript/cdi';
import { SimpleClass } from './index.js';

const applicationContext = new ApplicationContext([
    {name: 'someData', attr:'aValue', behave: () => {}},
    {Reference : (what) => { console.log (`Hello ${what}`)},
      name : 'aFunc'}]);
applicationContext.start();
applicationContext.get('someData').behave();
applicationContext.get('aFunc')('world!');
```

Singletons can also be defined with the common alias names `Service`,`Component` and `Singleton`

```javascript
import { ApplicationContext, Singleton, Service, Component } from '@alt-javascript/cdi';
const { SimpleSingleton, SimpleService, SimpleSingleton } from './index.js';

const context = new Context([
    new Singleton(SimpleSingleton), 
    new Service(SimpleService),
    new Component(SimpleSingleton)]);
const applicationContext = new ApplicationContext([context]);
applicationContext.start();
applicationContext.get('simpleSingleton');
applicationContext.get('simpleService');
applicationContext.get('simpleComponent');
```
### Prototype (transient) Components

Prototype, or transient scoped objects can be defined with Prototype definition, or Transient definition.  These
objects are created each time they are requested from the context, or wired by the context lifecycle.

```javascript
import { ApplicationContext, Prototype, Transient }  from '@alt-javascript/cdi';
import { SimpleClass, SimpleTransient }  from './index.js';

const applicationContext = new ApplicationContext(new Prototype(SimpleClass));
const applicationContext = new ApplicationContext(new Transient(SimpleTransient));
applicationContext.start();
applicationContext.get('simpleClass');
```

### Explicit Component Definitions

Use the Component class to declare the full explicit definition of a component, allow full control.

```javascript
import { ApplicationContext, Component }  from '@alt-javascript/cdi';
import { SimpleClass, SimpleTransient } from './index.js';

const applicationContext = new ApplicationContext(
    new Component({
        Reference : SimpleClass,
        name : 'useAnExplicitName',
        qualifier : '@my-scope/SimpleClass',
        scope : Scopes.SERVICE,
    }));

applicationContext.start();
applicationContext.get('useAnExplicitName');
```

### Component Factory Definitions

A component can be created by referencing a factory function directly.

```javascript
import { ApplicationContext, Component } from '@alt-javascript/cdi';
import { MyClass }  from './index.js';

const applicationContext = new ApplicationContext(
    new Component({
        factory : MyClass.someStaticFunction(),
        name : 'fromAFactory',
        qualifier : '@my-scope/SimpleClass',
        scope : Scopes.SERVICE,
    }));

applicationContext.start();
applicationContext.get('useAnExplicitName');
```
### Component Property Injection (wiring)

Component properties are autowired by name, by default.  In the example `classB` and `classC`  will be autowired,
but `classD`, which is non-null will be let alone.  The `attribute` will remain null if not found in the application
context.

```javascript
export default class ClassA {
  constructor() {
    this.classB = null;
    this.classC = 'autowired';
    this.classD = new new ClassD();
    this.attribute = null;
  }
};
```

Configuration values that are booted with `@alt-javascript/boot` are injected with the familiar placeholder syntax.

```javascript
export default class ClassA {
  constructor() {
    this.attribute = '${get.this.from.config}';
  }
};
```

### Advanced Component Property Injection, factory and wireFactory functions

Properties can be injected, directly from functions, or from references to functions on other components using
the explicit `Property` declaration class.

```javascript
    const context = new Context([
      {
        name: 'singletonFactory',
        generator: (param) => ({ name: 'simplePrototype', attr: param }),
      },
      new Service({
        Reference: 'MyServiceService',
          properties: [new Property({
              name:'myServiceProperty',
              factory: 'singletonFactory',
              factoryFunction: 'generator',
              factoryArgs: 'one'})]
      })]);

    const applicationContext = new ApplicationContext([context]);
    applicationContext.start();
    const myServiceService = applicationContext.get('myServiceService');
    assert.exists(myServiceService, 'myServiceService exists');
    assert.equal(myServiceService.myServiceProperty.attr, 'one', 'myServiceService.myServiceProperty.attr == one');
```

Where the context of the target component being wired is required, a `wireFactory` can be declared on a `prototype`
and the target `Component` instance is passed as an argument by default.  The `ApplicationContext` declares a 
`logger` prototype with the `loggerFactory` component as the `wireFactory`, allowing the component qualifier to be
used as the logger category (true).

### Global components: 

The ApplicationContext is designed to  play nicely with other projects in the `@alt-javascript` scope, so the
booted `config`, `loggerFactory`, `logger`, `loggerCategoryCache` are available.  

Any component declared with a `logger` and `qualifier` properties will be injected with an appropriate logger,
as if by _magic_.

<a name="license">License</a>
-----------------------------

May be freely distributed under the [MIT license](https://raw.githubusercontent.com/alt-javascript/cdi/master/LICENSE).

Copyright (c) 2021 Craig Parravicini    
