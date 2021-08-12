module.exports = class SimpleConfigProperty {
  constructor() {
    // eslint-disable-next-line no-template-curly-in-string
    this.attribute = '${pathtovalue:2}';
  }
};
