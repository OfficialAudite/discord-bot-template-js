require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

const Bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates
	],
	partials: [
		Partials.Channel,
		Partials.Message
	]
});

Bot.commands = new Collection();

console.log("=== Global LAN Party Bot ===");

// Load all handlers (e.g., events and slash commands)
for (const handler of ["events", "slash_cmds"]) {
	require(`./handlers/${handler}`)(Bot);
}

Bot.login(process.env.TOKEN);
