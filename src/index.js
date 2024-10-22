// dotenv accessible from anywhere in codebase
require("dotenv").config();
const { commandsText } = require("./localization/commandsText");
// Destructuring things pulled from library
const { Client, Collection, IntentsBitField } = require("discord.js");
const databaseFile = require("./database/database");
const {
  createCommand,
  readCommands,
  updateCommand,
  deleteCommand,
} = require("./database/crud");
const fs = require("fs");

// Initialize the database on bot startup
const db = databaseFile.initDatabase((err) => {
  if (err) {
    console.error("Failed to initialize the database:", err.message);
  } else {
    console.log("Database initialized successfully.");
  }
});

// Fetch and store commands from the database
const fetchDatabaseCommands = () => {
  readCommands((err, commands) => {
    if (err) {
      console.error("Error reading commands from the database:", err.message);
      return;
    }
    // Store each command from the database in client.commands
    commands.forEach((cmd) => {
      client.commands.set(cmd.name, {
        data: {
          name: cmd.name,
          description: cmd.description,
        },
        // Add a simple execute function for the dynamic commands
        execute: async (interaction) => {
          switch (actionType) {
            case commandsText.actiontype.acceptedTypeEnum.SelfReply.id: {
              interaction.reply(description);
              break;
            }
            case commandsText.actiontype.acceptedTypeEnum.ReplyInHere.id: {
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
    });
    console.log("Database commands added to the client.commands collection");
  });
};

if (db) {
  // Now you can use the CRUD functions here
  // Fetch and store commands from the database after initialization
  fetchDatabaseCommands();
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

global.client = client;

// Create a collection (map) to store all commands
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set the command in the collection with the command name as the key
  client.commands.set(command.data.name, command);
}

client.on("ready", (c) => {
  // ` tilda-key is used to allow these variable macros
  console.log(`${c.user.tag} is online.`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === commandsText.hey.name) {
      interaction.reply("hey!");
      return;
    } else {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
    return;
  } else if (interaction.isButton()) {
    try {
      await interaction.deferReply({ ephemeral: true });
      const role = interaction.guild.roles.cache.get(interaction.customId);
      if (!role) {
        interaction.editReply({
          content: `${role} no longer exists`,
          ephemeral: true,
        });
        return;
      }
      const hasRole = interaction.member.roles.cache.has(role.id);
      if (hasRole) {
        await interaction.member.roles.remove(role);
        await interaction.editReply(`The role ${role} has been removed`);
        return;
      } else {
        await interaction.member.roles.add(role);
        await interaction.editReply(`The role ${role} has been added`);
        return;
      }
    } catch (err) {
      console.error("There was an error with the interactionCreate", err);
    }
  }
});

client.on("messageCreate", (message) => {
  // Don't handle bot messages
  if (message.author.bot) {
    return;
  }
  console.log(message.content);
  if (message.content == "yah") {
    message.reply("yeet");
  }
});

client.login(process.env.BOT_TOKEN);

// CLOSE GRACEFULLY
const handleExit = (signal) => {
  console.log(`${signal} received: Closing database...`);
  databaseFile.closeDatabase(() => {
    console.log("Exiting process gracefully.");
    process.exit(0);
  });
};

// Catch common process escape signals
process.on("SIGINT", () => handleExit("SIGINT"));
process.on("SIGTERM", () => handleExit("SIGTERM"));

// Optional: Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  handleExit("Uncaught Exception");
});
