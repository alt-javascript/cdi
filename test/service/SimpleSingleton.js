const { v4: uuidv4 } = require('uuid');

module.exports = class SimpleSingleton {
  constructor() {
    this.uuid = uuidv4;
  }
};
