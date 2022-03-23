import { config } from '@alt-javascript/config';
import { test } from '@alt-javascript/boot';
import { LoggerFactory } from '@alt-javascript/logger';
import {ApplicationContext} from "./index.js";

test({ config });

const logger = LoggerFactory.getLogger('@alt-javascript/cdi/server');

const context = { name: 'SimpleClass',
    require: './test/service/SimpleClass.js',
};

const applicationContext = new ApplicationContext(context,config);
await applicationContext.start();

const simpleClass = applicationContext.get('simpleClass');

logger.info(`Simple class is ${simpleClass}`);