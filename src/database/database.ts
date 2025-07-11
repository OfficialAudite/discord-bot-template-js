import sqlite3 from 'sqlite3';
import { DatabaseCommand } from '../types/command';
import { Logger } from '../utils/logger';
import crypto from 'crypto';

export class Database {
  private db: sqlite3.Database | null = null;
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database('database.db', (err) => {
        if (err) {
          this.logger.error('Failed to open database:', err);
          reject(err);
          return;
        }
        this.logger.info('Database connection established');
        this.createTables().then(resolve).catch(reject);
      });
    });
  }

  private async createTables(): Promise<void> {
    const commandsTable = `
      CREATE TABLE IF NOT EXISTS slash_commands (
        name TEXT PRIMARY KEY,
        hash TEXT NOT NULL,
        command_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const guildSettingsTable = `
      CREATE TABLE IF NOT EXISTS guild_settings (
        guild_id TEXT PRIMARY KEY,
        prefix TEXT DEFAULT '!',
        welcome_channel_id TEXT,
        log_channel_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const userStatsTable = `
      CREATE TABLE IF NOT EXISTS user_stats (
        user_id TEXT,
        guild_id TEXT,
        commands_used INTEGER DEFAULT 0,
        messages_sent INTEGER DEFAULT 0,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, guild_id)
      );
    `;

    try {
      await this.run(commandsTable);
      await this.run(guildSettingsTable);
      await this.run(userStatsTable);
      this.logger.info('Database tables created successfully');
    } catch (error) {
      this.logger.error('Failed to create tables:', error);
      throw error;
    }
  }

  private run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  private all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  hashCommandData(data: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  async getCommandHash(name: string): Promise<string | null> {
    try {
      const row = await this.get('SELECT hash FROM slash_commands WHERE name = ?', [name]);
      return row ? row.hash : null;
    } catch (error) {
      this.logger.error('Failed to get command hash:', error);
      return null;
    }
  }

  async updateCommandHash(name: string, hash: string, commandId: string): Promise<void> {
    try {
      await this.run(
        `INSERT INTO slash_commands (name, hash, command_id, updated_at)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(name) DO UPDATE SET 
           hash = excluded.hash,
           command_id = excluded.command_id,
           updated_at = CURRENT_TIMESTAMP`,
        [name, hash, commandId]
      );
      this.logger.database('update', 'slash_commands', { name, hash });
    } catch (error) {
      this.logger.error('Failed to update command hash:', error);
      throw error;
    }
  }

  async getAllCommandNames(): Promise<string[]> {
    try {
      const rows = await this.all('SELECT name FROM slash_commands');
      return rows.map(row => row.name);
    } catch (error) {
      this.logger.error('Failed to get all command names:', error);
      return [];
    }
  }

  async deleteCommandHash(name: string): Promise<void> {
    try {
      await this.run('DELETE FROM slash_commands WHERE name = ?', [name]);
      this.logger.database('delete', 'slash_commands', { name });
    } catch (error) {
      this.logger.error('Failed to delete command hash:', error);
      throw error;
    }
  }

  async getGuildSettings(guildId: string): Promise<any> {
    try {
      const row = await this.get('SELECT * FROM guild_settings WHERE guild_id = ?', [guildId]);
      return row;
    } catch (error) {
      this.logger.error('Failed to get guild settings:', error);
      return null;
    }
  }

  async updateGuildSettings(guildId: string, settings: Partial<{
    prefix: string;
    welcomeChannelId: string;
    logChannelId: string;
  }>): Promise<void> {
    try {
      const current = await this.getGuildSettings(guildId);
      if (current) {
        await this.run(
          `UPDATE guild_settings SET 
           prefix = COALESCE(?, prefix),
           welcome_channel_id = COALESCE(?, welcome_channel_id),
           log_channel_id = COALESCE(?, log_channel_id),
           updated_at = CURRENT_TIMESTAMP
           WHERE guild_id = ?`,
          [settings.prefix, settings.welcomeChannelId, settings.logChannelId, guildId]
        );
      } else {
        await this.run(
          `INSERT INTO guild_settings (guild_id, prefix, welcome_channel_id, log_channel_id)
           VALUES (?, ?, ?, ?)`,
          [guildId, settings.prefix || '!', settings.welcomeChannelId, settings.logChannelId]
        );
      }
      this.logger.database('update', 'guild_settings', { guildId, settings });
    } catch (error) {
      this.logger.error('Failed to update guild settings:', error);
      throw error;
    }
  }

  async updateUserStats(userId: string, guildId: string, type: 'command' | 'message'): Promise<void> {
    try {
      const column = type === 'command' ? 'commands_used' : 'messages_sent';
      await this.run(
        `INSERT INTO user_stats (user_id, guild_id, ${column}, last_active)
         VALUES (?, ?, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, guild_id) DO UPDATE SET 
           ${column} = user_stats.${column} + 1,
           last_active = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP`,
        [userId, guildId]
      );
      this.logger.database('update', 'user_stats', { userId, guildId, type });
    } catch (error) {
      this.logger.error('Failed to update user stats:', error);
    }
  }

  async getUserStats(userId: string, guildId: string): Promise<any> {
    try {
      const row = await this.get(
        'SELECT * FROM user_stats WHERE user_id = ? AND guild_id = ?',
        [userId, guildId]
      );
      return row;
    } catch (error) {
      this.logger.error('Failed to get user stats:', error);
      return null;
    }
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            this.logger.error('Failed to close database:', err);
            reject(err);
          } else {
            this.logger.info('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
} 