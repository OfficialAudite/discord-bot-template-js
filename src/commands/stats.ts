import { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('View your statistics or another user\'s statistics')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('The user to view stats for (optional)')
      .setRequired(false)
  );

export async function execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
  if (!interaction.guildId) {
    await interaction.reply({ content: 'This command can only be used in a server!', ephemeral: true });
    return;
  }

  const targetUser = interaction.options.getUser('user') || interaction.user;
  const stats = await client.database.getUserStats(targetUser.id, interaction.guildId);

  const embed = new EmbedBuilder()
    .setColor('#ff9900')
    .setTitle(`📊 Statistics for ${targetUser.tag}`)
    .addFields(
      { name: 'Commands Used', value: `${stats?.commands_used || 0}`, inline: true },
      { name: 'Messages Sent', value: `${stats?.messages_sent || 0}`, inline: true },
      { name: 'Last Active', value: stats?.last_active ? new Date(stats.last_active).toLocaleDateString() : 'Never', inline: true }
    )
    .setThumbnail(targetUser.displayAvatarURL())
    .setTimestamp();

  if (targetUser.id === interaction.user.id) {
    embed.setDescription('Your personal statistics');
  }

  await interaction.reply({ embeds: [embed] });
} 