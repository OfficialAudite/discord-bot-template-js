import { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check the bot\'s latency and API response time');

export async function execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
  const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
  
  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setTitle('🏓 Pong!')
    .addFields(
      { name: 'Bot Latency', value: `\`${sent.createdTimestamp - interaction.createdTimestamp}ms\``, inline: true },
      { name: 'API Latency', value: `\`${Math.round(client.ws.ping)}ms\``, inline: true },
      { name: 'Uptime', value: `\`${Math.floor(client.uptime! / 1000 / 60)} minutes\``, inline: true }
    )
    .setTimestamp()
    .setFooter({ text: `Requested by ${interaction.user.tag}` });

  await interaction.editReply({ content: '', embeds: [embed] });
} 