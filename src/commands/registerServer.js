const { SlashCommandBuilder } = require("@discordjs/builders");
const { commandsText } = require("../localization/commandsText");
const { createServerEntry } = require("../database/CRUDs/serverCrud");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("registerwithserver")
    .setDescription("Register your server with this bot. Not required."),
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    const guildId = interaction.guildId;
    if (!guildId) return;
    createServerEntry(guildId, (err, result) => {
      if (err) {
        console.error("Error registering guild entry: ", err);
        interaction.reply({
          content: "Failed to register guild. Please try again.",
          ephemeral: true,
        });
        return;
      }
      interaction.reply({
        content: "Successfully registered guild ID: " + guildId,
        ephemeral: true,
      });
      console.log("Successfully registered guild ID: " + guildId);
    });
  },
};
