// Test setup file
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Mock Discord.js client for testing
jest.mock('discord.js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    user: {
      tag: 'TestBot#1234',
      setPresence: jest.fn(),
    },
    ws: {
      ping: 50,
    },
    uptime: 3600000, // 1 hour
    guilds: {
      cache: new Map(),
    },
    commands: new Map(),
  })),
  Collection: jest.fn(),
  GatewayIntentBits: {
    Guilds: 1,
    GuildMessages: 2,
    GuildMembers: 4,
    MessageContent: 8,
    GuildVoiceStates: 16,
    GuildPresences: 32,
    GuildMessageReactions: 64,
  },
  Partials: {
    Channel: 1,
    Message: 2,
    Reaction: 4,
    User: 8,
    GuildMember: 16,
  },
  ActivityType: {
    Watching: 3,
  },
  Events: {
    ClientReady: 'ready',
    InteractionCreate: 'interactionCreate',
    GuildCreate: 'guildCreate',
    GuildDelete: 'guildDelete',
  },
})); 