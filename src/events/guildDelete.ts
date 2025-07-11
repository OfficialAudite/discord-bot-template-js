import { Client, Events, Guild } from 'discord.js';
import { Logger } from '../utils/logger';

export const event = {
  name: Events.GuildDelete,
  once: false,
  async execute(client: Client, guild: Guild): Promise<void> {
    const logger = new Logger();
    
    logger.info(`Left guild: ${guild.name} (${guild.id})`);
    
    // Clean up guild data from database (optional)
    // You might want to keep the data for analytics or future re-joining
    // await client.database.deleteGuildSettings(guild.id);
  },
}; 