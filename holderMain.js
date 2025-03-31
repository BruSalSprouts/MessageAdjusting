const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");

// Load environment variables
require("dotenv").config();
const DISCORD_TOKEN = process.env.BOT_TOKEN;

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Grab all the utility command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING]! The command at ${filePath} is missing a required 'data' or 'execute' property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");

// Log in to Discord with your client's token
client.login(DISCORD_TOKEN);
