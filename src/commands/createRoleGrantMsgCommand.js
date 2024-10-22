const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");
const { commandsText } = require("../localization/commandsText");

/// https://discordjs.guide/popular-topics/embeds.html#embed-preview

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createrolegrantmessage")
    .setDescription("Creates a message that grants roles")
    .addStringOption((option) =>
      option.setName("message").setDescription("the text of the role message")
    ),
  async execute(interaction) {
    const callerGuild = interaction.guild;
    if (!callerGuild) {
      console.log(
        "ERROR: createRoleGrantMsgCommand - Interaction is not in a guild."
      );
    }
    const rows = [];
    const messageText = interaction.options.getString("message");
    const embed = new EmbedBuilder().setDescription(messageText);
    var row = new ActionRowBuilder();
    const serverRoles = callerGuild.roles.cache;
    serverRoles.forEach((role) => {
      console.log(`Got role ${role.name}`);
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.name)
          .setStyle(ButtonStyle.Primary)
      );
      if (row.components.length === 5) {
        rows.push(row);
        row = new ActionRowBuilder();
      }
    });
    // Add the last row if it has any buttons
    if (row.components.length > 0) {
      rows.push(row);
    }
    interaction.channel.send({ embeds: [embed], components: rows });
  },
};
