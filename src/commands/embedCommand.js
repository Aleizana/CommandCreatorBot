const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { commandsText } = require("../localization/commandsText");

/// https://discordjs.guide/popular-topics/embeds.html#embed-preview

module.exports = {
  data: new SlashCommandBuilder()
    .setName(commandsText.testEmbedCmd.name)
    .setDescription(commandsText.testEmbedCmd.description),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle(commandsText.testEmbedCmd.name)
      .setDescription(commandsText.testEmbedCmd.description);
    interaction.reply({ embeds: [embed] });
  },
};
