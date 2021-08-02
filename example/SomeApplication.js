const {ApplicationContext} = require('..');
const {context} = require('service');

module.exports = class SomeApplication {
    constructor() {
        this.applicationContext = new ApplicationContext([context]);
    }


}