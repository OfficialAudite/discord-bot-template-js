import { 
  SlashCommandBuilder, 
  SlashCommandSubcommandsOnlyBuilder,
  ChatInputCommandInteraction,
  Client
} from 'discord.js';

export interface Command {
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder;
  execute: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void>;
  cooldown?: number;
  permissions?: string[];
  guildOnly?: boolean;
}

export interface Event {
  name: string;
  once?: boolean;
  execute: (client: Client, ...args: any[]) => Promise<void>;
}

export interface DatabaseCommand {
  name: string;
  hash: string;
  commandId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BotConfig {
  token: string;
  clientId: string;
  guildId?: string;
  environment: 'development' | 'production';
  logLevel: 'error' | 'warn' | 'info' | 'debug';
} 