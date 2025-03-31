/**
 * This script sets up a Discord bot using discord.js that registers a slash command
 * to set the active channel for bot responses and responds to messages in that channel.
 *
 * Flags are used to specify additional options for interaction responses.
 * In this case, the flag `64` is used to make the response ephemeral (visible only to the user who triggered the interaction).
 *
 * @requires discord.js
 * @requires dotenv/config
 *
 * @constant {Client} client - The Discord client instance.
 * @constant {string} token - The bot token from the environment variables.
 * @constant {string} clientId - The client ID of the bot.
 * @constant {string} currentGuildId - The guild ID where the bot is registered.
 * @constant {Channel|null} activeChannel - The channel where the bot will respond.
 *
 * @function registerCommands - Registers the slash commands with the Discord API.
 * @function client.once('ready') - Logs in the bot and registers commands when the bot is ready.
 * @function client.on('interactionCreate') - Handles the interaction for the slash command to set the active channel.
 * @function client.on('messageCreate') - Responds with "Hello, World!" in the active channel when a user sends "hello bot".
 */
// Require the necessary discord.js classes
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
} = require("discord.js");
require("dotenv").config();
// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.BOT_TOKEN;
// const clientId = process.env.CLIENT_ID;
// const currentGuildId = process.env.GUILD_ID;
const clientId = "1345068734838210652";
// const currentGuildId = "827329502501142568"; // StarryPeri Guild ID!
const currentGuildId = "608741602244034571"; // Test Server Guild ID!
let activeChannel = null;

// Register commands with Discord API
const commands = [
  // talkhere command
  new SlashCommandBuilder()
    .setName("talkhere")
    .setDescription("Set this channel as the bot's response channel"),
].map((command) => command.toJSON());

// Register the command with Discord API
const rest = new REST({ version: "10" }).setToken(token);

async function registerCommands() {
  try {
    console.log("Registering slash commands...");
    await rest.put(Routes.applicationGuildCommands(clientId, currentGuildId), {
      body: commands,
    });
    console.log("Successfully registered slash commands.");
  } catch (error) {
    console.error("Error registering commands: ", error);
  }
}

// Hello world!
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await registerCommands();
});

// Command for setting what channel the bot should talk in
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "talkhere") {
    activeChannel = interaction.channel;

    // Defer the reply first
    await interaction.deferReply({ flags: 64 });

    // Send the response after deferring
    await interaction.editReply("✅ I will now respond in this channel!");
  }
});

// Bot responds with "Hello world!" in the selected active channel
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (activeChannel && message.content.toLowerCase() === "hello bot") {
    await activeChannel.send("Hello, World! Why am I alive?");
  }
});

// client.on("messageCreate", async (message) => {
//   // Ignore messages from bots
//   if (message.author.bot) return;

//   // Command: '/talkHere' -
// });

// Log in to Discord with your client's token
client.login(token);
