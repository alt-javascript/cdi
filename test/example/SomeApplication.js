const {ApplicationContext} = require('../../index');
const {context} = require('test/service');

module.exports = class SomeApplication {
    constructor() {
        this.applicationContext = new ApplicationContext([context]);
    }


}
