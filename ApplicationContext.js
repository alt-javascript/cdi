const _ = require('lodash');
const LoggerFactory = require('@alt-javascript/logger/LoggerFactory');
const Scopes = require('./context/Scopes');

const logger = LoggerFactory.getLogger('@alt-javascript/contexts/ApplicationContext');

module.exports = class ApplicationContext {
  constructor(contexts, profiles, name) {
    this.contexts = contexts;
    this.components = {};
    this.profiles = profiles;
    this.name = name || 'default';
  }

  lifeCycle() {
    logger.verbose(`ApplicationContext (${this.name}) lifecycle started.`);
    this.parseContexts(this.contexts, this.components, this.profiles, this.name);
    this.createSingletons(this.components);
    this.injectSingletonDependencies(this.components);
    logger.verbose(`ApplicationContext (${this.name}) lifecycle completed.`);
  }

  parseContexts() {
    logger.verbose('Parsing configured contexts started.');
    if (this.contexts) {
      if (this.contexts?.constructor?.name === 'Context') {
        this.parseContextComponents();
      } else if (_.isArray(this.contexts)) {
        logger.debug('Processing context list');
        for (const context of this.contexts) {
          this.parseContextComponents(context);
        }
      }
    } else {
      const msg = `ApplicationContext (${this.name}) received a nullish context.`;
      logger.error(msg);
      throw msg;
    }
    logger.verbose('Parsing configured contexts completed.');
  }

  parseContextComponents(context) {
    logger.verbose('Processing context components started');
    if (context.components) {
      if (_.isArray(context.components)) {
        for (const component of context.components) {
          this.parseContextComponent(component);
        }
      } else {

      }
    } else {
      const msg = `ApplicationContext (${this.name}) received a nullish context component.`;
      logger.error(msg);
      throw msg;
    }
    logger.verbose('Processing context components completed');
  }

  parseContextComponent(component) {
    const constructr = component?.reference?.prototype?.constructor;
    const $component = {};
    $component.isClass = constructr !== undefined;

    $component.name = component.name || _.lowerFirst(constructr.name);
    $component.qualifier = component.qualifier || _.lowerFirst(constructr.qualifier);
    $component.scope = component.scope || _.lowerFirst(constructr.scope);
    $component.profiles = component.profiles || constructr.profiles;

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
    for (const key of Object.keys(this.components)) {
      const component = this.components[key];
      if (component.scope === Scopes.SINGLETON) {
        if (component.isClass) {
          component.instance = new component.reference();
        } else {
          component.instance = component.reference;
        }

        logger.verbose(`Created singleton (${component.name})`);
      }
    }
    logger.verbose('Creating singletons completed');
  }

  injectSingletonDependencies() {
    logger.verbose('Injecting singletons dependencies started');
    for (const key of Object.keys(this.components)) {
      const component = this.components[key];
      if (component.scope === Scopes.SINGLETON) {
        for (const propKey of Object.keys(component.instance)) {
          const property = component.instance[propKey];
          const autowire = property?.name === 'Autowire';
          if (autowire) {
            component.instance[propKey] = this.getEntry(propKey);
          }
        }
      }
    }
    logger.verbose('Injecting singleton dependencies completed');
  }

  getEntry(reference) {
    if (this.components[reference]) {
      logger.verbose(`Found component (${reference})`);
    }
    const msg = `Failed component reference lookup for (${reference})`;
    logger.error(msg);
    throw new Error(msg);
  }
};
