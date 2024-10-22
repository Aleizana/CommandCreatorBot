const commandsText = {
  hey: {
    name: "hey",
    description: "Replies with hey!",
  },
  createacommand: {
    name: "createacommand",
    description: "Creates a command in this bot per your input specifications",
    options: {
      name: {
        name: "name",
        description: "The name of the custom command",
      },
      description: {
        name: "description",
        description: "The description of the custom command",
      },
    },
  },
  testEmbedCmd: {
    name: "embed",
    description: "Sends an embed",
  },
};

module.exports = { commandsText };
