const { SlashCommandBuilder } = require("@discordjs/builders");
const { createCommand } = require("../database/crud.js");
const { commandsText } = require("../localization/commandsText");
const { ActionTypeEnum } = require("../localization/enumText.js");
const { spawn } = require("child_process");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(commandsText.createacommand.name)
    .setDescription(commandsText.createacommand.description)
    .addStringOption((option) =>
      option
        .setName(commandsText.createacommand.options.name.name)
        .setDescription(commandsText.createacommand.options.name.description)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(commandsText.createacommand.options.description.name)
        .setDescription(
          commandsText.createacommand.options.description.description
        )
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName(ActionTypeEnum.actiontype.name)
        .setDescription(ActionTypeEnum.actiontype.description)
        .addChoices(
          {
            name: ActionTypeEnum.actiontype.acceptedTypeEnum.SelfReply.text,
            value: ActionTypeEnum.actiontype.acceptedTypeEnum.SelfReply.id,
          },
          {
            name: ActionTypeEnum.actiontype.acceptedTypeEnum.ReplyInHere.text,
            value: ActionTypeEnum.actiontype.acceptedTypeEnum.ReplyInHere.id,
          }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const locOptionsRef = commandsText.createacommand.options;
    const locActionTypeRef = ActionTypeEnum.actiontype;
    const locAcceptedTypeEnumRef = locActionTypeRef.acceptedTypeEnum;
    const commandName = interaction.options
      .getString(locOptionsRef.name.name)
      .toLowerCase();
    const description = interaction.options.getString(
      locOptionsRef.description.name
    );
    const actionType = interaction.options.getNumber(locActionTypeRef.name);
    const userId = interaction.user.id;
    createCommand(
      userId,
      commandName,
      description,
      actionType,
      (err, result) => {
        if (err) {
          // Handle the error (e.g., log it, inform the user)
          console.error("Error creating command:", err);
          // [Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: commands.name]
          if (err.errno == 19) {
            interaction.reply({
              content: `Command with the name ${commandName} already exists!`,
              ephemeral: true,
            });
          } else {
            interaction.reply({
              content: "Failed to create the command. Please try again.",
              ephemeral: true,
            });
          }
        } else {
          console.log("Command created with ID:", result.id);
          interaction.reply({
            content: `Command ${commandName} created successfully!`,
            ephemeral: true,
          });

          // Dynamically register the commands by running register-commands.js
          const child = spawn("node", ["./src/register-commands.js"]);

          child.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
          });

          child.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
          });

          child.on("close", (code) => {
            if (code === 0) {
              console.log("register-commands.js executed successfully.");
              // Set the command in the collection with the command name as the key
              client.commands.set(commandName, {
                data: {
                  name: commandName,
                  description: description,
                },
                // Add a simple execute function for the dynamic commands
                execute: async (interaction) => {
                  switch (actionType) {
                    case locAcceptedTypeEnumRef.SelfReply.id: {
                      interaction.reply(description);
                      break;
                    }
                    case locAcceptedTypeEnumRef.ReplyInHere.id: {
                      interaction.channel.send(description);
                      break;
                    }
                    default: {
                      console.log("User entered an unhandled command type.");
                      break;
                    }
                  }
                  return;
                },
              });
            } else {
              console.error(`register-commands.js exited with code ${code}`);
            }
          });
        }
      }
    );
  },
};
