const _ = require('lodash');
const Context = require('./context/Context');
const Scopes = require('./context/Scope');
const LoggerFactory = require('@alt-javascript/logger/LoggerFactory');
const logger = LoggerFactory.getLogger('@alt-javascript/contexts/ApplicationContext');

module.exports = class ApplicationContext {

    constructor(contexts, profiles, name) {
        this.logger = LoggerFactory.getLogger('@alt-javascript/contexts/ApplicationContext');
        this.contexts = contexts;
        this.components = {};
        this.profiles = profiles;
        this.name = name || 'default';
        ApplicationContext.lifeCycle(this.logger, this.contexts, this.components, this.profiles, this.name)
    }

    static lifeCycle(logger, contexts, components, profiles, name) {
        logger.verbose(`ApplicationContext (${name}) lifecycle started.`);
        ApplicationContext.parseContexts(logger, contexts, components, profiles, name);
        ApplicationContext.createSingletons(logger, components);
        ApplicationContext.injectSingletonDependencies(logger, components);
        logger.verbose(`ApplicationContext (${name}) lifecycle completed.`);
    }

    static parseContexts(logger, contexts, components, profiles, name) {
        logger.verbose(`Parsing configured contexts started.`);
        if (contexts) {
            if (contexts?.constructor?.name == 'Context') {
                ApplicationContext.parseContextComponents(logger, contexts, components, profiles, name);
            } else if (_.isArray(contexts)) {
                logger.debug('Processing context list');
                for (let context of contexts) {
                    ApplicationContext.parseContextComponents(logger, context, components, profiles, name);
                }
            }
        } else {
            const msg = `ApplicationContext (${name}) received a nullish context.`;
            logger.error(msg);
            throw msg;
        }
        logger.verbose(`Parsing configured contexts completed.`);
    }

    static parseContextComponents(logger, context, components, profiles, name) {
        logger.verbose('Processing context components started');
        if (components){
            if (_.isArray(components)){
                for (let component of context.components) {
                    ApplicationContext.parseContextComponent(logger, component, components, profiles);
                }
            } else {

            }

        } else {
            const msg = `ApplicationContext (${name}) received a nullish context component.`;
            logger.error(msg);
            throw msg;
        }
        logger.verbose('Processing context components completed');
    }

    static parseContextComponent(logger, component, components, profiles) {
        let constructr = component?.reference?.prototype?.constructor;
        component.isClass = constructr !== undefined;

        component.name = component.name || _.lowerFirst(constructr.name);
        component.qualifier = component.qualifier || _.lowerFirst(constructr.qualifier);
        component.scope = component.scope || _.lowerFirst(constructr.scope);
        component.profiles = component.profiles || constructr.profiles;

        component.isActive = component.profiles === null;
        component.isActive = component.profiles === undefined;
        component.isActive = (_.isArray(component.profiles)) && component.profiles.length === 0;
        component.isActive = component.profiles?.name !== undefined;
        component.isActive = component.profiles?.name !== null;

        let activeProfiles = profiles || '';
        if (!component.isActive) {
            component.isActive = activeProfiles.contains(component.profiles?.name);
            component.isActive = _.isArray(component.profiles) && _.findIndex(component.profiles, (profile) => {
                return activeProfiles.contains(profile.name)
            })
        }

        if (component.isActive) {
            if (!components[component.name]) {
                components[component.name] = component;
                logger.verbose(`Added application context entry (${component.name}) with ${component.scope} scope`);
            } else {
                let msg = `Duplicate definition of application context entry (${component.name})`
                logger.error(msg);
                throw new Error(msg);
            }
        } else {
            logger.verbose(`Skipped inactive application context entry (${component.name}), with scope ${component.scope}`);
        }

    }

    static createSingletons(logger, components) {
        logger.verbose('Creating singletons started');
        for (let key in components){
            let entry = components[key];
            if (entry.scope === Scopes.SINGLETON){
                if (entry.isClass){
                    entry.instance = new entry.reference;
                } else {
                    entry.instance = entry.reference
                }

                logger.verbose(`Created singleton (${entry.name})`);
            }
        }
        logger.verbose('Creating singletons completed');
    }

    static injectSingletonDependencies(logger, components) {
        logger.verbose('Injecting singletons dependencies started');
        for (let key in components){
            let entry = components[key];
            if (entry.scope == Scopes.SINGLETON){
                for (let propKey in entry.instance) {
                    let property = entry.instance[propKey];
                    let autowire = property?.name == 'Autowire'
                    if (autowire){
                        entry.instance[propKey] = ApplicationContext.getEntry(logger,components,propKey);
                    }
                }
            }
        }
        logger.verbose('Injecting singleton dependencies completed');

    }

    static getEntry (logger,components,reference){
        if (components[reference]){
            logger.verbose(`Found entry (${reference})`);

        }
        let msg = `Failed entry reference lookup for (${reference})`;
        logger.error(msg);
        throw new Error(msg);
    }
    getEntry(reference) {
    }


}
