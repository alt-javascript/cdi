const _ = require('lodash');
const Context = require('./context/Context');
const Scopes = require('./context/Scopes');
const LoggerFactory = require('@alt-javascript/logger/LoggerFactory');
const logger = LoggerFactory.getLogger('@alt-javascript/contexts/ApplicationContext');

module.exports = class ApplicationContext {

    constructor(contexts, profiles, name) {
        this.logger = LoggerFactory.getLogger('@alt-javascript/contexts/ApplicationContext');
        this.contexts = contexts;
        this.entries = {};
        this.profiles = profiles;
        this.name = name || 'default';
        ApplicationContext.lifeCycle(this.logger, this.contexts, this.entries, this.profiles, this.name)
    }

    static lifeCycle(logger, contexts, entries, profiles, name) {
        logger.verbose(`ApplicationContext (${name}) lifecycle started.`);
        ApplicationContext.parseContexts(logger, contexts, entries, profiles);
        ApplicationContext.createSingletons(logger, entries);
        ApplicationContext.injectSingletonDependencies(logger, entries);
        logger.verbose(`ApplicationContext (${name}) lifecycle completed.`);
    }

    static parseContexts(logger, contexts, entries, profiles) {
        logger.verbose(`Parsing configured contexts started.`);
        if (contexts) {
            if (contexts?.constructor?.name == 'Context') {
                ApplicationContext.parseContextEntries(logger, contexts, entries, profiles);
            } else if (_.isArray(contexts)) {
                logger.debug('Processing context list');
                for (let context of contexts) {
                    ApplicationContext.parseContextEntries(logger, context, entries, profiles);
                }
            }
        } else {
            const msg = `ApplicationContext (${name}) received a nullish context.`;
            logger.error(msg);
            throw msg;
        }
        logger.verbose(`Parsing configured contexts completed.`);
    }

    static parseContextEntries(logger, context, entries, profiles) {
        logger.verbose('Processing context entries started');
        for (let entry of context.entries) {
            ApplicationContext.parseContextEntry(logger, entry, entries, profiles);
        }
        logger.verbose('Processing context entries completed');
    }

    static parseContextEntry(logger, entry, entries, profiles) {
        let constructr = entry?.reference?.prototype?.constructor;
        entry.isClass = constructr !== undefined;

        entry.name = entry.name || _.lowerFirst(constructr.name);
        entry.qualifier = entry.qualifier || _.lowerFirst(constructr.qualifier);
        entry.scope = entry.scope || _.lowerFirst(constructr.scope);
        entry.profiles = entry.profiles || constructr.profiles;

        entry.isActive = entry.profiles === null;
        entry.isActive = entry.profiles === undefined;
        entry.isActive = (_.isArray(entry.profiles)) && entry.profiles.length === 0;
        entry.isActive = entry.profiles?.name !== undefined;
        entry.isActive = entry.profiles?.name !== null;

        let activeProfiles = profiles || '';
        if (!entry.isActive) {
            entry.isActive = activeProfiles.contains(entry.profiles?.name);
            entry.isActive = _.isArray(entry.profiles) && _.findIndex(entry.profiles, (profile) => {
                return activeProfiles.contains(profile.name)
            })
        }

        if (entry.isActive) {
            if (!entries[entry.name]) {
                entries[entry.name] = entry;
                logger.verbose(`Added application context entry (${entry.name}) with ${entry.scope} scope`);
            } else {
                let msg = `Duplicate definition of application context entry (${entry.name})`
                logger.error(msg);
                throw new Error(msg);
            }
        } else {
            logger.verbose(`Skipped inactive application context entry (${entry.name}), with scope ${entry.scope}`);
        }

    }

    static createSingletons(logger, entries) {
        logger.verbose('Creating singletons started');
        for (let key in entries){
            let entry = entries[key];
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

    static injectSingletonDependencies(logger, entries) {
        logger.verbose('Injecting singletons dependencies started');
        for (let key in entries){
            let entry = entries[key];
            if (entry.scope == Scopes.SINGLETON){
                for (let propKey in entry.instance) {
                    let property = entry.instance[propKey];
                    let autowire = property?.name == 'Autowire'
                    if (autowire){
                        entry.instance[propKey] = ApplicationContext.getEntry(logger,entries,propKey);
                    }
                }
            }
        }
        logger.verbose('Injecting singleton dependencies completed');

    }

    static getEntry (logger,entries,reference){
        if (entries[reference]){
            logger.verbose(`Found entry (${reference})`);

        }
        let msg = `Failed entry reference lookup for (${reference})`;
        logger.error(msg);
        throw new Error(msg);
    }
    getEntry(reference) {
    }


}
