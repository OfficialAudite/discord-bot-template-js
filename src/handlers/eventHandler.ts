import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Event } from '../types/command';
import { Logger } from '../utils/logger';

export class EventHandler {
  private client: Client;
  private logger: Logger;
  private eventsPath: string;

  constructor(client: Client) {
    this.client = client;
    this.logger = new Logger();
    this.eventsPath = join(__dirname, '../events');
  }

  async loadEvents(): Promise<void> {
    try {
      const eventFiles = readdirSync(this.eventsPath).filter(file => 
        file.endsWith('.ts') || file.endsWith('.js')
      );

      let loadedCount = 0;
      for (const file of eventFiles) {
        try {
          const eventPath = join(this.eventsPath, file);
          const event: Event = require(eventPath);

          if (!event.name || typeof event.execute !== 'function') {
            this.logger.warn(`Invalid event structure in ${file}`);
            continue;
          }

          if (event.once) {
            this.client.once(event.name, (...args) => this.executeEvent(event, ...args));
          } else {
            this.client.on(event.name, (...args) => this.executeEvent(event, ...args));
          }

          loadedCount++;
          this.logger.debug(`Loaded event: ${event.name}`);
        } catch (error) {
          this.logger.error(`Failed to load event ${file}:`, error);
        }
      }

      this.logger.info(`Loaded ${loadedCount} events successfully`);
    } catch (error) {
      this.logger.error('Failed to load events:', error);
      throw error;
    }
  }

  private async executeEvent(event: Event, ...args: any[]): Promise<void> {
    try {
      await event.execute(this.client, ...args);
      this.logger.event(event.name, { args: args.length });
    } catch (error) {
      this.logger.error(`Error executing event ${event.name}:`, error);
    }
  }
} 