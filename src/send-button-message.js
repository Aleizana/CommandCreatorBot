// dotenv accessible from anywhere in codebase
require("dotenv").config();
const { commandsText } = require("./localization/commandsText");
// Destructuring things pulled from library
const { Client, Collection, IntentsBitField } = require("discord.js");
const databaseFile = require("./database/database");

// Access the arguments passed to the script
// slice(2) to ignore 'node' and 'send-button-message.js'
// We are expecting the id of a messageWithButtons record in the database
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("No arugments passed! Ending process.");
  process.exit(0);
} else {
  console.log("Arguments passed:");
  args.forEach((arg, index) => {
    console.log(`Argument ${index + 1}: ${arg}`);
  });
}

// Bot instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  // ` tilda-key is used to allow these variable macros
  console.log(`${c.user.tag} is online.`);
});

client.login(process.env.BOT_TOKEN);
