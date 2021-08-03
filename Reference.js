const Reference = class Reference {
  constructor(entry) {
    this.entry = entry;
  }
};

module.exports = function reference(entry) { new Reference(entry); };
