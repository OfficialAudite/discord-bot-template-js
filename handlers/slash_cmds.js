const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { DB } = require('../database/helper');

module.exports = async (Bot) => {
  const db = new DB();
  await db.initDatabase();

  const commandsPath = path.join(__dirname, '../slash_cmds');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  const fileCommandNames = new Set();
  const commandsToRegister = [];

  let loaded = 0, updated = 0, skipped = 0;

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      const jsonData = command.data.toJSON();
      const hash = db.hashCommandData(jsonData);
      const existingHash = await db.getCommandHash(command.data.name);

      fileCommandNames.add(command.data.name);
      Bot.commands.set(command.data.name, command);
      
      if (existingHash === hash) {
        skipped++;
        continue;
      }

      commandsToRegister.push(jsonData);
      updated++;
      loaded++;
    } else {
      console.warn(`[WARNING] Command at ${filePath} is missing required "data" or "execute" property.`);
    }
  }

  console.log(`${loaded} Loaded. ${updated} Updated. ${skipped} Skipped.`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    // Register new/updated commands
    const registeredCommands = await rest.put(
      Routes.applicationCommands(process.env.BotID),
      { body: commandsToRegister }
    );

    // Update hash + ID in DB
    for (const command of registeredCommands) {
      const hash = db.hashCommandData(command);
      await db.updateCommandHash(command.name, hash, command.id);
    }

    // Fetch all globally registered commands
    const allGlobalCommands = await rest.get(Routes.applicationCommands(process.env.BotID));
    const dbEntries = await db.getAllCommandHashes();

    for (const entry of dbEntries) {
      if (!fileCommandNames.has(entry.name)) {
        const globalCmd = allGlobalCommands.find(cmd => cmd.name === entry.name);
        if (globalCmd) {
          console.log(`Deleting stale global command "${entry.name}"...`);
          await rest.delete(Routes.applicationCommand(process.env.BotID, globalCmd.id));
        }
        await db.deleteCommandHash(entry.name);
      }
    }

    console.log('All commands processed.');
  } catch (error) {
    console.error('Error during command sync:', error);
  }
};
