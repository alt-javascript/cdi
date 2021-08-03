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
        for (let i = 0; i < this.contexts.length; i++) {
          this.parseContextComponents(this.contexts[i]);
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
        for (let i = 0; i < context.components.length; i++) {
          this.parseContextComponent(context.components[i]);
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
    const constructr = component?.Reference?.prototype?.constructor;
    const $component = {};
    $component.isClass = constructr !== undefined;

    $component.name = component.name || _.lowerFirst(constructr.name);
    $component.qualifier = component.qualifier || _.lowerFirst(constructr.qualifier);
    $component.scope = component.scope || _.lowerFirst(constructr.scope);
    $component.Reference = component.Reference;

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
            component.instance[insKeys[j]] = this.getEntry(insKeys[j]);
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
