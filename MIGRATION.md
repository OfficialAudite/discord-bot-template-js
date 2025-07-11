# Migration Guide

This guide helps you migrate from the old JavaScript version to the new TypeScript version of the Discord bot template.

## 🔄 What's Changed

### Major Changes

1. **TypeScript Support** - Full type safety and modern development experience
2. **New Project Structure** - Reorganized for better maintainability
3. **Enhanced Database** - More robust SQLite wrapper with additional tables
4. **Advanced Logging** - Winston-based logging system
5. **Better Error Handling** - Comprehensive error handling throughout
6. **Utility Classes** - Pre-built utilities for common tasks

### File Structure Changes

| Old Location | New Location | Notes |
|--------------|--------------|-------|
| `Main.js` | `src/index.ts` | Main entry point |
| `slash_cmds/` | `src/commands/` | Commands directory |
| `events/` | `src/events/` | Events directory |
| `handlers/` | `src/handlers/` | Handlers directory |
| `database/helper.js` | `src/database/database.ts` | Database wrapper |
| - | `src/utils/` | New utilities directory |
| - | `src/types/` | TypeScript type definitions |

## 📋 Migration Steps

### 1. Backup Your Data

```bash
# Backup your database
cp database.db database.db.backup

# Backup your commands
cp -r slash_cmds/ commands_backup/
```

### 2. Update Dependencies

The new version requires additional dependencies. Run:

```bash
npm install
```

### 3. Update Environment Variables

Update your `.env` file:

```env
# Old format
TOKEN=your-bot-token
BotID=your-app-id

# New format
TOKEN=your-bot-token
CLIENT_ID=your-app-id
NODE_ENV=development
LOG_LEVEL=info
```

### 4. Migrate Commands

Convert your JavaScript commands to TypeScript:

#### Old Format (JavaScript)
```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check ping'),
  
  async execute(Bot, interaction) {
    await interaction.reply('Pong!');
  }
};
```

#### New Format (TypeScript)
```typescript
import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check ping');

export async function execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply('Pong!');
}
```

### 5. Migrate Events

Convert your JavaScript events to TypeScript:

#### Old Format (JavaScript)
```javascript
module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log('Bot is ready!');
  }
};
```

#### New Format (TypeScript)
```typescript
import { Client, Events } from 'discord.js';

export const event = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client): Promise<void> {
    console.log('Bot is ready!');
  },
};
```

### 6. Update Database Usage

The database interface has changed:

#### Old Format
```javascript
const { DB } = require('../database/helper');
const db = new DB();
await db.initDatabase();
```

#### New Format
```typescript
// Database is now available through the client
await client.database.getUserStats(userId, guildId);
```

## 🔧 New Features

### 1. Permission Utilities

```typescript
import { PermissionUtils } from '../utils/permissions';
import { PermissionFlagsBits } from 'discord.js';

const hasPermission = await PermissionUtils.requirePermissions(
  interaction,
  [PermissionFlagsBits.ManageGuild],
  'You need Manage Server permission!'
);
```

### 2. Embed Utilities

```typescript
import { EmbedUtils } from '../utils/embeds';

const embed = EmbedUtils.success('Success!', 'Operation completed');
await interaction.reply({ embeds: [embed] });
```

### 3. Enhanced Logging

```typescript
// Logging is now available through the client
client.logger.info('Bot started successfully');
client.logger.error('An error occurred', error);
```

## 🗄️ Database Migration

The new version includes additional database tables. The migration is automatic, but you can verify:

```sql
-- Check if new tables exist
SELECT name FROM sqlite_master WHERE type='table';

-- Expected tables:
-- slash_commands
-- guild_settings  
-- user_stats
```

## 🧪 Testing

The new version includes testing infrastructure:

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Development Workflow

### Old Workflow
```bash
npm run dev
```

### New Workflow
```bash
# Development with hot reload
npm run dev

# Watch mode
npm run watch

# Production build
npm run build
npm start
```

## 🔍 Troubleshooting

### Common Migration Issues

1. **TypeScript Errors**
   - Install TypeScript: `npm install -g typescript`
   - Check type definitions in `src/types/`

2. **Import/Export Issues**
   - Use ES6 import/export syntax
   - Check file extensions (.ts)

3. **Database Errors**
   - Backup and recreate database if needed
   - Check file permissions

4. **Command Registration Issues**
   - Verify command structure
   - Check environment variables

### Getting Help

1. Check the logs in `logs/` directory
2. Enable debug mode: `LOG_LEVEL=debug`
3. Review the new documentation
4. Open an issue on GitHub

## ✅ Migration Checklist

- [ ] Backup existing data
- [ ] Update dependencies
- [ ] Convert commands to TypeScript
- [ ] Convert events to TypeScript
- [ ] Update environment variables
- [ ] Test bot functionality
- [ ] Update deployment scripts
- [ ] Review new features

## 🎉 Benefits of Migration

1. **Better Development Experience** - TypeScript provides better IDE support
2. **Improved Reliability** - Type safety catches errors early
3. **Enhanced Features** - New utilities and better error handling
4. **Future-Proof** - Modern architecture and dependencies
5. **Better Testing** - Built-in testing infrastructure
6. **Improved Logging** - Comprehensive logging system

---

**Need help with migration?** Open an issue on GitHub or check the documentation. 