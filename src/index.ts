import { config } from 'dotenv';
import { Client, Collection, GatewayIntentBits, Partials, ActivityType } from 'discord.js';
import { Logger } from './utils/logger';
import { Database } from './database/database';
import { EventHandler } from './handlers/eventHandler';
import { CommandHandler } from './handlers/commandHandler';
import { Command } from './types/command';

// Load environment variables
config();

// Create logger instance
const logger = new Logger();

// Create Discord client with modern intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember,
  ],
});

// Extend client with custom properties
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
    database: Database;
    logger: Logger;
  }
}

// Initialize client properties
client.commands = new Collection();
client.database = new Database();
client.logger = logger;

// Initialize handlers
const eventHandler = new EventHandler(client);
const commandHandler = new CommandHandler(client);

async function startBot(): Promise<void> {
  try {
    // Initialize database
    await client.database.init();
    logger.info('Database initialized successfully');

    // Load events and commands
    await eventHandler.loadEvents();
    await commandHandler.loadCommands();

    // Set bot presence
    client.user?.setPresence({
      activities: [
        {
          name: 'your commands 👀',
          type: ActivityType.Watching,
        },
      ],
      status: 'online',
    });

    // Login to Discord
    await client.login(process.env.TOKEN);
    logger.info(`${client.user?.tag} is now online!`);
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the bot
startBot(); 