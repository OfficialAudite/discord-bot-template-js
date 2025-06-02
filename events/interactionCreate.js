module.exports = {
	run: async (Bot, interaction) => {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.guild) return await interaction.reply({ content: "Commands work only in server chats", ephemeral: true });

		const command = Bot.commands.get(interaction.commandName);
		if (!command) return;

		try {
			await command.execute(Bot, interaction);
		} catch (err) {
			console.error(err);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: "An error occurred with this command", ephemeral: true });
			} else {
				await interaction.reply({ content: "An error occurred with this command", ephemeral: true });
			}
		}
	}
};
