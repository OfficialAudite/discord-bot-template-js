# Discord Bot Template v2.0

A modern, scalable Discord bot template built with **TypeScript**, **Discord.js v14**, and **SQLite**. Features advanced command management, comprehensive logging, and a robust database system.

## 🚀 Features

- ✅ **TypeScript Support** - Full type safety and modern development experience
- ✅ **Advanced Command System** - Automatic registration, hash tracking, and smart updates
- ✅ **Comprehensive Logging** - Winston-based logging with file and console output
- ✅ **SQLite Database** - Persistent storage with user stats, guild settings, and command tracking
- ✅ **Modern Architecture** - Clean separation of concerns with handlers and utilities
- ✅ **Error Handling** - Robust error handling and graceful degradation
- ✅ **Permission System** - Built-in permission checking utilities
- ✅ **Embed Utilities** - Pre-built embed templates for consistent UI
- ✅ **Development Tools** - ESLint, Jest testing, and hot reloading

## 📋 Requirements

- **Node.js** v18.0.0 or higher
- **TypeScript** v5.0.0 or higher
- A Discord Bot application with proper intents

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/OfficialAudite/discord-bot-template.git
cd discord-bot-template
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Bot Configuration
TOKEN=your-discord-bot-token
CLIENT_ID=your-discord-application-id

# Optional Settings
NODE_ENV=development
LOG_LEVEL=info
```

### 4. Build and Run

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Watch mode for development
npm run watch
```

## 📁 Project Structure

```
src/
├── commands/           # Slash command definitions
│   ├── ping.ts        # Example ping command
│   ├── info.ts        # Bot/server info command
│   └── stats.ts       # User statistics command
├── events/            # Discord event handlers
│   ├── ready.ts       # Bot ready event
│   ├── interactionCreate.ts
│   ├── guildCreate.ts
│   └── guildDelete.ts
├── handlers/          # Core system handlers
│   ├── commandHandler.ts
│   └── eventHandler.ts
├── database/          # Database management
│   └── database.ts    # SQLite wrapper
├── utils/             # Utility functions
│   ├── logger.ts      # Winston logger
│   ├── embeds.ts      # Embed templates
│   └── permissions.ts # Permission utilities
├── types/             # TypeScript type definitions
│   └── command.ts     # Command and event interfaces
└── index.ts           # Main entry point
```

## 🗄️ Database Schema

The bot uses SQLite with the following tables:

### `slash_commands`
- `name` (TEXT PRIMARY KEY) - Command name
- `hash` (TEXT) - Command data hash for change detection
- `command_id` (TEXT) - Discord API command ID
- `created_at` (DATETIME) - Creation timestamp
- `updated_at` (DATETIME) - Last update timestamp

### `guild_settings`
- `guild_id` (TEXT PRIMARY KEY) - Discord guild ID
- `prefix` (TEXT) - Custom command prefix
- `welcome_channel_id` (TEXT) - Welcome message channel
- `log_channel_id` (TEXT) - Logging channel
- `created_at` (DATETIME) - Creation timestamp
- `updated_at` (DATETIME) - Last update timestamp

### `user_stats`
- `user_id` (TEXT) - Discord user ID
- `guild_id` (TEXT) - Discord guild ID
- `commands_used` (INTEGER) - Number of commands used
- `messages_sent` (INTEGER) - Number of messages sent
- `last_active` (DATETIME) - Last activity timestamp
- `created_at` (DATETIME) - Creation timestamp
- `updated_at` (DATETIME) - Last update timestamp

## 🎯 Creating Commands

Commands are automatically loaded from the `src/commands/` directory. Here's an example:

```typescript
import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('example')
  .setDescription('An example command')
  .addStringOption(option =>
    option
      .setName('input')
      .setDescription('Some input')
      .setRequired(true)
  );

export async function execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
  const input = interaction.options.getString('input');
  await interaction.reply(`You said: ${input}`);
}
```

## 📝 Creating Events

Events are automatically loaded from the `src/events/` directory:

```typescript
import { Client, Events } from 'discord.js';

export const event = {
  name: Events.MessageCreate,
  once: false,
  async execute(client: Client, message: Message): Promise<void> {
    // Handle message event
  },
};
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TOKEN` | Discord bot token | Yes |
| `CLIENT_ID` | Discord application ID | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | No |

### Logging

The bot uses Winston for logging with the following levels:
- `error` - Error messages
- `warn` - Warning messages  
- `info` - General information
- `debug` - Debug information

Logs are saved to:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start in development mode |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run watch` | Start with file watching |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm test` | Run tests |
| `npm run deploy` | Build and start production |

## 🔒 Permissions

The bot includes a permission utility system:

```typescript
import { PermissionUtils } from '../utils/permissions';
import { PermissionFlagsBits } from 'discord.js';

// Check permissions
const hasPermission = await PermissionUtils.requirePermissions(
  interaction,
  [PermissionFlagsBits.ManageGuild],
  'You need Manage Server permission!'
);
```

## 🎨 Embed Utilities

Pre-built embed templates for consistent UI:

```typescript
import { EmbedUtils } from '../utils/embeds';

const embed = EmbedUtils.success('Success!', 'Operation completed successfully');
await interaction.reply({ embeds: [embed] });
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

Built by [OfficialAudite](https://github.com/OfficialAudite)

---

**Need help?** Open an issue or check the [Discord.js documentation](https://discord.js.org/).
