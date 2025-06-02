const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check ping'),
  
  async execute(Bot, interaction) {
    await interaction.reply('Pong!');
    const msg = await interaction.fetchReply();
    await interaction.editReply(`Pong!\n🏓 : \`${msg.createdTimestamp - interaction.createdTimestamp}ms\`\n🌐 : \`${Bot.ws.ping}ms\``);
  }
};
