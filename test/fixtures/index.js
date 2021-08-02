const {config} = require ("@alt-javascript/config");
const {boot} = require ("@alt-javascript/boot");

const {CachingLoggerFactory,LoggerCategoryCache,LoggerFactory} = require ('@alt-javascript/logger');
const loggerCategoryCache = new LoggerCategoryCache();
const cachingLoggerFactory = new CachingLoggerFactory(config,loggerCategoryCache);

if (config.get('logging.test.fixtures.quiet',true)){
    boot({config:config,loggerFactory:cachingLoggerFactory,loggerCategoryCache:loggerCategoryCache});
}else {
    boot({config:config});
}

const logger = LoggerFactory.getLogger('@alt-javascript/scanner-darkly/test/fixtures/index');

exports.mochaGlobalSetup = async function setup() {
    logger.verbose('mocha global setup: started');
    //  ...
    logger.verbose('mocha global setup: completed');
};

exports.mochaGlobalTeardown = async function teardown() {
    logger.verbose('mocha global teardown: started');
    //  ...
    logger.verbose('mocha global teardown: completed');
};
