const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { DB } = require('../database/helper');

module.exports = async (Bot) => {
  const db = new DB();
  await db.initDatabase();

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  const commandsPath = path.join(__dirname, '../slash_cmds');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  const commandsToRegister = [];
  const currentCommandNames = new Set();
  let hasHashChanges = false;

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      const jsonData = command.data.toJSON();
      const hash = db.hashCommandData(jsonData);
      const existingHash = await db.getCommandHash(command.data.name);

      Bot.commands.set(command.data.name, command);
      currentCommandNames.add(command.data.name);
      commandsToRegister.push(jsonData);

      if (existingHash !== hash) {
        hasHashChanges = true;
        await db.updateCommandHash(command.data.name, hash);
        console.log(`↻ Updated or new command detected: ${command.data.name}`);
      }
    } else {
      console.warn(`[WARNING] Command at ${filePath} is missing required "data" or "execute".`);
    }
  }

  // Handle removed commands
  const existingCommandNamesInDb = await db.getAllCommandNames();
  const deletedCommands = existingCommandNamesInDb.filter(name => !currentCommandNames.has(name));

  if (deletedCommands.length > 0) {
    try {
      const apiCommands = await rest.get(Routes.applicationCommands(process.env.BotID));

      for (const deletedName of deletedCommands) {
        const toDelete = apiCommands.find(cmd => cmd.name === deletedName);
        if (toDelete) {
          await rest.delete(Routes.applicationCommand(process.env.BotID, toDelete.id));
          console.log(`🗑 Removed deleted command from API: ${deletedName}`);
        }
        await db.deleteCommandHash(deletedName);
        console.log(`🗃️ Removed deleted command from DB: ${deletedName}`);
      }
    } catch (err) {
      console.error(`❌ Error during deletion of removed commands:`, err);
    }
  }

  // Upload all if any hash has changed
  if (!hasHashChanges) {
    console.log('✅ No new or updated commands. Slash command sync skipped.');
    return;
  }

  try {
    console.log(`⬆️ Uploading ${commandsToRegister.length} updated application (/) commands...`);
    const data = await rest.put(
      Routes.applicationCommands(process.env.BotID),
      { body: commandsToRegister },
    );
    console.log(`✅ Successfully reloaded ${data.length} commands.`);
  } catch (error) {
    console.error('❌ Error uploading commands:', error);
  }
};
