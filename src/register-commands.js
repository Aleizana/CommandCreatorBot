// Always remember to set this
require("dotenv").config();
const { commandsText } = require("./localization/commandsText");
const { ActionTypeEnum } = require("./localization/enumText");
const { REST, Routes } = require("discord.js");
const {
  createCommand,
  readCommands,
  updateCommand,
  deleteCommand,
} = require("./database/crud");
const fs = require("fs");
const { DatabaseCommand } = require("./database/databasecommand");

// GETTING COMMANDS FROM FILES
const commandsFromFiles = [];
const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"));
// Read each command's data and add it to the list of commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commandsFromFiles.push(command.data.toJSON());
}

// Each item of the array is a single command
const commands = [
  // Hey command
  new DatabaseCommand(
    commandsText.hey.name,
    commandsText.hey.description,
    ActionTypeEnum.actiontype.acceptedTypeEnum.SelfReply.id
  ),
];

// TODO: Make this its' own file or remove it
commandsFromFiles.push(commands[0]);

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log("Fetching commands from the database...");

    const dbCommands = await new Promise((resolve, reject) => {
      readCommands((err, rows) => {
        if (err) {
          // If there's an error, the Promise is rejected
          // Thus, we go to the catch branch. Suitable for an essential function such as readCommands
          reject(err);
        } else {
          // If successful, the Promise is resolved with `rows`
          // Thus, dbCommands takes 'rows'
          resolve(rows);
        }
      });
    });

    // Map each row of the commands database table into a DatabaseCommand object
    const dbCommandsFormatted = dbCommands.map(
      (cmd) => new DatabaseCommand(cmd.name, cmd.description, cmd.actionType)
    );

    // Combine commands from files and commands from the database
    const combinedCommands = [...commandsFromFiles, ...dbCommandsFormatted];

    console.log("Registering slash commands...");
    // Wait for response from api request
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: combinedCommands }
    );
    console.log("Slash commands registered successfully.");
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
