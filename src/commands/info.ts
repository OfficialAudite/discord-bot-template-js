import { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder, Guild } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Get information about the bot or server')
  .addSubcommand(subcommand =>
    subcommand
      .setName('bot')
      .setDescription('Get information about the bot')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('server')
      .setDescription('Get information about the server')
  );

export async function execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'bot') {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🤖 Bot Information')
      .addFields(
        { name: 'Bot Name', value: client.user?.tag || 'Unknown', inline: true },
        { name: 'Created', value: client.user?.createdAt.toLocaleDateString() || 'Unknown', inline: true },
        { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Users', value: `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`, inline: true },
        { name: 'Uptime', value: `${Math.floor(client.uptime! / 1000 / 60 / 60)}h ${Math.floor((client.uptime! / 1000 / 60) % 60)}m`, inline: true },
        { name: 'Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true }
      )
      .setThumbnail(client.user?.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } else if (subcommand === 'server') {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a server!', ephemeral: true });
      return;
    }

    const guild = interaction.guild as Guild;
    const owner = await guild.fetchOwner();
    const channels = guild.channels.cache;
    const roles = guild.roles.cache;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`📊 ${guild.name} Information`)
      .addFields(
        { name: 'Owner', value: owner.user.tag, inline: true },
        { name: 'Created', value: guild.createdAt.toLocaleDateString(), inline: true },
        { name: 'Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Channels', value: `${channels.size}`, inline: true },
        { name: 'Roles', value: `${roles.size}`, inline: true },
        { name: 'Boost Level', value: `${guild.premiumTier}`, inline: true }
      )
      .setThumbnail(guild.iconURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
} 