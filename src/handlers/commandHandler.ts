import { Client, REST, Routes, ChatInputCommandInteraction } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command } from '../types/command';
import { Logger } from '../utils/logger';

export class CommandHandler {
  private client: Client;
  private logger: Logger;
  private commandsPath: string;
  private rest: REST;

  constructor(client: Client) {
    this.client = client;
    this.logger = new Logger();
    this.commandsPath = join(__dirname, '../commands');
    this.rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);
  }

  async loadCommands(): Promise<void> {
    try {
      const commandFiles = readdirSync(this.commandsPath).filter(file => 
        file.endsWith('.ts') || file.endsWith('.js')
      );

      const commandsToRegister: any[] = [];
      const currentCommandNames = new Set<string>();
      let hasHashChanges = false;

      for (const file of commandFiles) {
        try {
          const commandPath = join(this.commandsPath, file);
          const command: Command = require(commandPath);

          if (!this.validateCommand(command, file)) {
            continue;
          }

          const jsonData = command.data.toJSON();
          const hash = this.client.database.hashCommandData(jsonData);
          const existingHash = await this.client.database.getCommandHash(command.data.name);

          this.client.commands.set(command.data.name, command);
          currentCommandNames.add(command.data.name);
          commandsToRegister.push(jsonData);

          if (existingHash !== hash) {
            hasHashChanges = true;
            await this.client.database.updateCommandHash(command.data.name, hash, 'temp');
            this.logger.info(`Updated command: ${command.data.name}`);
          }
        } catch (error) {
          this.logger.error(`Failed to load command ${file}:`, error);
        }
      }

      // Handle removed commands
      await this.handleRemovedCommands(currentCommandNames);

      // Register commands if there are changes
      if (hasHashChanges && commandsToRegister.length > 0) {
        await this.registerCommands(commandsToRegister);
      } else {
        this.logger.info('No command changes detected, skipping registration');
      }

      this.logger.info(`Loaded ${this.client.commands.size} commands successfully`);
    } catch (error) {
      this.logger.error('Failed to load commands:', error);
      throw error;
    }
  }

  private validateCommand(command: Command, filename: string): boolean {
    if (!command.data || !command.execute) {
      this.logger.warn(`Invalid command structure in ${filename}`);
      return false;
    }

    if (!command.data.name || !command.data.description) {
      this.logger.warn(`Missing required properties in ${filename}`);
      return false;
    }

    return true;
  }

  private async handleRemovedCommands(currentCommands: Set<string>): Promise<void> {
    try {
      const existingCommands = await this.client.database.getAllCommandNames();
      const deletedCommands = existingCommands.filter(name => !currentCommands.has(name));

      if (deletedCommands.length > 0) {
        const apiCommands = await this.rest.get(
          Routes.applicationCommands(process.env.CLIENT_ID!)
        ) as any[];

        for (const deletedName of deletedCommands) {
          const toDelete = apiCommands.find(cmd => cmd.name === deletedName);
          if (toDelete) {
            await this.rest.delete(
              Routes.applicationCommand(process.env.CLIENT_ID!, toDelete.id)
            );
            this.logger.info(`Removed command from Discord API: ${deletedName}`);
          }
          await this.client.database.deleteCommandHash(deletedName);
          this.logger.info(`Removed command from database: ${deletedName}`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to handle removed commands:', error);
    }
  }

  private async registerCommands(commands: any[]): Promise<void> {
    try {
      this.logger.info(`Registering ${commands.length} commands...`);
      
      const data = await this.rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID!),
        { body: commands }
      ) as any[];

      // Update command IDs in database
      for (const command of data) {
        await this.client.database.updateCommandHash(command.name, 'temp', command.id);
      }

      this.logger.info(`Successfully registered ${data.length} commands`);
    } catch (error) {
      this.logger.error('Failed to register commands:', error);
      throw error;
    }
  }

  async handleInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.commands.get(interaction.commandName);
    if (!command) {
      this.logger.warn(`Unknown command: ${interaction.commandName}`);
      return;
    }

    try {
      // Update user stats
      if (interaction.guildId) {
        await this.client.database.updateUserStats(
          interaction.user.id,
          interaction.guildId,
          'command'
        );
      }

      // Log command execution
      this.logger.command(
        interaction.commandName,
        interaction.user.id,
        interaction.guildId || undefined
      );

      // Execute command
      await command.execute(this.client, interaction);
    } catch (error) {
      this.logger.error(`Error executing command ${interaction.commandName}:`, error);
      
      const errorMessage = 'An error occurred while executing this command.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  }
} 