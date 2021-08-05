const { v4: uuidv4 } = require('uuid');

module.exports = class SimpleClass {
  constructor() {
    this.uuid = uuidv4();
  }
};
