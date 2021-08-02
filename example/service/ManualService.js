const {Configure} = require('../..');
module.exports = class ManualService {
    constructor() {
        this.logger = Configure;
        this.autoService = Configure;
        this.someProperty = Configure;
        this.someEntry = Configure;
    }
}