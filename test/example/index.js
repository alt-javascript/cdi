const {config} = require ("@alt-javascript/config");
const {boot} = require ("@alt-javascript/boot");

boot({config});

const {ApplicationContext} = require('../../index');
const {context} = require('../service');


const LoggerFactory = require('@alt-javascript/logger/LoggerFactory');
const logger = LoggerFactory.getLogger('@alt-javascript/contexts/example');

logger.info('Starting application context');
const applicationContext =  new ApplicationContext([context]);
logger.info('Application context started');

