const {ApplicationContext} = require('..');
const {context} = require('./service');
const LoggerFactory = require('@demo/log/LoggerFactory');
const logger = LoggerFactory.getLogger('@demo/cdi/example');

logger.info('Starting application context');
const applicationContext =  new ApplicationContext([context]);
logger.info('Application context started');

