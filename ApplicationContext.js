const _ = require('lodash');
const { Boot } = require('@alt-javascript/boot');
const LoggerFactory = require('@alt-javascript/logger/LoggerFactory');
const { Context, Component, Scopes } = require('./context');

const logger = LoggerFactory.getLogger('@alt-javascript/contexts/ApplicationContext');

module.exports = class ApplicationContext {

  static DEFAULT_CONTEXT_NAME = 'default';
  static DEFAULT_CONFIG_CONTEXT_PATH = 'context';
  constructor(contexts, profiles, name) {
    this.contexts = _.isArray(contexts) ? contexts: (contexts ? [contexts] : []);
    this.components = {};
    this.profiles = profiles;
    this.name = name || ApplicationContext.DEFAULT_CONTEXT_NAME;
    this.configContextPath = process.env.NODE_CONFIG_CONTEXT_PATH || ApplicationContext.DEFAULT_CONFIG_CONTEXT_PATH;
    this.config = Boot.root('config');
  }

  lifeCycle() {
    logger.verbose(`ApplicationContext (${this.name}) lifecycle started.`);
    this.parseContexts(this.contexts, this.components, this.profiles, this.name);
    this.createSingletons(this.components);
    this.injectSingletonDependencies(this.components);
    logger.verbose(`ApplicationContext (${this.name}) lifecycle completed.`);
  }

  detectConfigContext(){
    logger.verbose('Detecting config contexts started.');
    if (this.config){
      if (this.config.has(this.configContextPath)){
        logger.verbose(`Detected config context at ${this.configContextPath}, adding context.`);
        this.contexts.push(this.config.get(this.configContextPath));
      }
    }
    logger.verbose('Detecting config contexts completed.');
  }

  parseContexts() {
    logger.verbose('Parsing configured contexts started.');
    this.detectConfigContext();
    for (let i = 0; i < this.contexts.length; i++) {
      if (this.contexts[i]) {
        if (this.contexts[i]?.constructor?.name === 'Context') {
          this.parseContextComponents(this.contexts[i]);
        } else {
          this.parseContextComponents(new Context(this.contexts[i]));
        }
      } else {
        const msg = `ApplicationContext (${this.name}) received a nullish context.`;
        logger.error(msg);
        throw msg;
      }
    }
    logger.verbose('Parsing configured contexts completed.');
  }

  deriveContextComponent(contextComponent) {
    if (contextComponent.name || contextComponent.Reference){
      this.parseContextComponent(contextComponent);
    } else {
      let contextKeys = Object.keys(contextComponent);
      for (let i = 0; i < contextKeys.length; i++) {
        let name = contextKeys[i];
        let component = contextComponent[name];
        component.name = name;
        this.parseContextComponent(component);
      }
    }
  }
  parseContextComponents(context) {
    logger.verbose('Processing context components started');
    if (context.components) {
      if (_.isArray(context.components)) {
        for (let i = 0; i < context.components.length; i++) {
          this.deriveContextComponent(context.components[i]);
        }
      } else {
        this.deriveContextComponent(context.component);
      }
    } else {
      const msg = `ApplicationContext (${this.name}) received a nullish context component.`;
      logger.error(msg);
      throw msg;
    }
    logger.verbose('Processing context components completed');
  }

  parseContextComponent(componentArg) {
    let component = componentArg;
    if (component?.constructor?.name !== 'Component'
        && component?.constructor?.name !== 'Singleton'
        && component?.constructor?.name !== 'Prototype'){
      component =  new Component (
          component, component.name,
          component.qualifier,
          component.scope,
          component.properties,component.profiles);
      component.require = componentArg.require;
    }
    const constructr = component?.Reference?.prototype?.constructor;
    const $component = {};
    $component.isClass = constructr !== undefined;

    $component.name = _.lowerFirst(component.name) || _.lowerFirst(constructr.name);
    $component.qualifier = component.qualifier || _.lowerFirst(constructr?.qualifier);
    $component.scope = component.scope || _.lowerFirst(constructr?.scope) || Scopes.SINGLETON;
    $component.Reference = component.Reference;
    if (component.require) {
      $component.Reference = require(component.require);
      $component.isClass = ($component?.Reference?.prototype?.constructor !== undefined);
    }

    $component.profiles = component.profiles || constructr?.profiles;

    $component.isActive = component.profiles === null;
    $component.isActive = component.profiles === undefined;
    $component.isActive = (_.isArray(component.profiles)) && component.profiles.length === 0;
    $component.isActive = component.profiles?.name !== undefined;
    $component.isActive = component.profiles?.name !== null;

    const activeProfiles = this.profiles || '';
    if (!$component.isActive) {
      $component.isActive = activeProfiles.contains(component.profiles?.name);
      $component.isActive = _.isArray(component.profiles)
          && _.findIndex(component.profiles,
            (profile) => activeProfiles.contains(profile.name));
    }

    if ($component.isActive) {
      if (!this.components[$component.name]) {
        this.components[$component.name] = $component;
        logger.verbose(`Added application context component (${$component.name}) with ${$component.scope} scope`);
      } else {
        const msg = `Duplicate definition of application context component (${$component.name})`;
        logger.error(msg);
        throw new Error(msg);
      }
    } else {
      logger.verbose(`Skipped inactive application context component (${$component.name}), with scope ${$component.scope}`);
    }
  }

  createSingletons() {
    logger.verbose('Creating singletons started');
    const keys = Object.keys(this.components);
    for (let i = 0; i < keys.length; i++) {
      const component = this.components[keys[i]];
      if (component.scope === Scopes.SINGLETON) {
        if (component.isClass) {
          component.instance = new component.Reference();
        } else {
          component.instance = component.Reference;
        }
        logger.verbose(`Created singleton (${component.name})`);
      }
    }
    logger.verbose('Creating singletons completed');
  }

  injectSingletonDependencies() {
    logger.verbose('Injecting singletons dependencies started');
    const keys = Object.keys(this.components);
    for (let i = 0; i < keys.length; i++) {
      const component = this.components[keys[i]];
      if (component.scope === Scopes.SINGLETON) {
        const insKeys = Object.keys(component.instance);
        for (let j = 0; j < insKeys.length; j++) {
          const property = component.instance[insKeys[j]];
          const autowire = property?.name === 'Autowire';
          if (autowire) {
            component.instance[insKeys[j]] = this.get(insKeys[j]);
          }
        }
      }
    }
    logger.verbose('Injecting singleton dependencies completed');
  }

  get(reference) {
    if (this.components[reference]) {
      logger.verbose(`Found component (${reference})`);
      if (this.components[reference].scope === Scopes.SINGLETON) {
        logger.verbose(`Component (${reference}) is scoped as (${Scopes.SINGLETON}), returning existing instance.`);
        return this.components[reference].instance;
      }
      if (this.components[reference].isClass) {
        logger.verbose(`Component (${reference}) is scoped as (${Scopes.PROTOTYPE}), returning new instance.`);
        return  new this.components[reference].Reference();
      } else {
        logger.verbose(`Component (${reference}) is scoped as (${Scopes.PROTOTYPE}), returning deep clone.`);
        return _.cloneDeep(this.components[reference]);
      }
    }
    const msg = `Failed component reference lookup for (${reference})`;
    logger.error(msg);
    throw new Error(msg);
  }
};
