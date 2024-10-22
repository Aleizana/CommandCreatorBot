class DatabaseCommand {
  constructor(name, description, actionType) {
    this.name = name;
    this.description = description;
    this.actionType = actionType;
  }
}

module.exports = { DatabaseCommand };
