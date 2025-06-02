const { DB } = require('../database/helper');

module.exports = {
	run: async (Bot) => {
		const db = new DB();
		await db.initDatabase();

		console.log('Initialized database');

		Bot.user.setPresence({ activities: [{ name: "you criminals 👀", type: 3 }] });
		return console.log(`${Bot.user.tag} Online!`);
	}
}