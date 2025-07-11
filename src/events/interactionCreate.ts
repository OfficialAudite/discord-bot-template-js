import { Client, Events, ChatInputCommandInteraction } from 'discord.js';
import { CommandHandler } from '../handlers/commandHandler';

export const event = {
  name: Events.InteractionCreate,
  once: false,
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const commandHandler = new CommandHandler(client);
    await commandHandler.handleInteraction(interaction);
  },
}; 