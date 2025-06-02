# Discord Bot Template (Node.js)

A simple and modern Discord bot starter template built with **Node.js**, **Discord.js v14**, and **SQLite**.  
Ideal for scalable bot development with command version tracking and automatic global slash command management.

---

## 📦 Features

- ✅ Slash command support  
- ✅ SQLite database integration  
- ✅ Auto-register & update global slash commands  
- ✅ Auto-remove unused commands from Discord  
- ✅ Lightweight & easy to customize  
- ✅ Built with Node.js v22+ and Discord.js v14

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/OfficialAudite/discord-bot-template-js.git
cd discord-bot-template-js
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of the project:

```env
TOKEN=your-bot-token
BotID=your-discord-app-id
```

> You can find your bot token and App ID in the [Discord Developer Portal](https://discord.com/developers/applications).

---

## 🚀 Run the Bot

```bash
npm run dev
```

---

## 🗃️ Project Structure

```
.
├── Main.js                 # Entry point of the bot
├── slash_cmds/             # Slash command definitions (auto-registered)
├── database/
│   └── helper.js           # SQLite wrapper + hashing logic
├── events/
│   └── messageCreate.js    # Example of dynamic event handling
├── lib/
│   └── example.js          # Here you can place your own libraries
├── .env                    # Environment variables
└── package.json
```

---

## 🧠 Slash Command Hashing

This template uses a hashing system to:
- Skip registration for unchanged commands
- Track command hashes in a local SQLite database
- Automatically remove global commands if the command file is deleted

This makes deployment and updates **zero-maintenance**.

---

## 📜 License

[MIT](LICENSE)

You are free to use, modify, and distribute this template with attribution.

---

## 🧊 Requirements

- **Node.js** v22.14.0 or higher  
- A Discord Bot application  
- SQLite (auto-handled via `sqlite3` npm package)

---

## 🙏 Credits

Built by [OfficialAudite](https://github.com/OfficialAudite)

---

## 💬 Support

Found an issue or want to contribute? Feel free to open a PR or issue.
