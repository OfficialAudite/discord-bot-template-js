import { Client, Events } from 'discord.js';
import { Logger } from '../utils/logger';

export const event = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client): Promise<void> {
    const logger = new Logger();
    
    logger.info(`Logged in as ${client.user?.tag}`);
    logger.info(`Bot is ready! Serving ${client.guilds.cache.size} guilds`);
    
    // Log guild information
    client.guilds.cache.forEach(guild => {
      logger.info(`Guild: ${guild.name} (${guild.id}) - ${guild.memberCount} members`);
    });
  },
}; 