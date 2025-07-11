import { Client, Events, Guild } from 'discord.js';
import { Logger } from '../utils/logger';

export const event = {
  name: Events.GuildCreate,
  once: false,
  async execute(client: Client, guild: Guild): Promise<void> {
    const logger = new Logger();
    
    logger.info(`Joined guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members`);
    
    // Initialize guild settings in database
    try {
      await client.database.updateGuildSettings(guild.id, {
        prefix: '!',
      });
      logger.info(`Initialized settings for guild: ${guild.name}`);
    } catch (error) {
      logger.error(`Failed to initialize settings for guild ${guild.name}:`, error);
    }
  },
}; 