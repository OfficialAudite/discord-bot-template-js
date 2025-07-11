# Deployment Guide

This guide covers deploying the Discord bot template to various environments.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Required
TOKEN=your-discord-bot-token
CLIENT_ID=your-discord-application-id

# Optional
NODE_ENV=production
LOG_LEVEL=info
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build and Run

```bash
# Build TypeScript
npm run build

# Start the bot
npm start
```

## 🐳 Docker Deployment

### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  discord-bot:
    build: .
    container_name: discord-bot
    environment:
      - TOKEN=${TOKEN}
      - CLIENT_ID=${CLIENT_ID}
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
      - ./database.db:/app/database.db
    restart: unless-stopped
```

### Build and Run

```bash
# Build the image
docker build -t discord-bot .

# Run the container
docker run -d \
  --name discord-bot \
  --env-file .env \
  -v $(pwd)/logs:/app/logs \
  -v $(pwd)/database.db:/app/database.db \
  discord-bot
```

## ☁️ Cloud Deployment

### Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Heroku

1. Create a `Procfile`:
```
worker: npm start
```

2. Deploy using Heroku CLI:
```bash
heroku create your-bot-name
heroku config:set TOKEN=your-token
heroku config:set CLIENT_ID=your-client-id
git push heroku main
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Set environment variables
3. Configure build command: `npm run build`
4. Configure run command: `npm start`

## 🔧 Production Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TOKEN` | Discord bot token | Yes |
| `CLIENT_ID` | Discord application ID | Yes |
| `NODE_ENV` | Environment (production/development) | No |
| `LOG_LEVEL` | Logging level | No |

### Logging

In production, logs are written to:
- `logs/error.log` - Error messages only
- `logs/combined.log` - All log messages

### Database

The SQLite database file (`database.db`) should be persisted across deployments.

## 🔒 Security Considerations

1. **Never commit your `.env` file**
2. **Use environment variables for secrets**
3. **Regularly rotate your bot token**
4. **Monitor bot permissions**
5. **Backup your database regularly**

## 📊 Monitoring

### Health Checks

The bot includes basic health monitoring:

```bash
# Check if bot is running
curl http://localhost:3000/health
```

### Log Monitoring

Monitor these log files:
- `logs/error.log` - For errors
- `logs/combined.log` - For general activity

### Discord Bot Status

- Check bot status in Discord Developer Portal
- Monitor bot's presence in servers
- Review command usage statistics

## 🔄 Updates

### Automatic Updates

The bot automatically:
- Detects command changes
- Registers new commands
- Removes deleted commands
- Updates command hashes

### Manual Updates

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build and restart
npm run build
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check if token is correct
   - Verify bot has proper intents
   - Check logs for errors

2. **Commands not registering**
   - Ensure CLIENT_ID is correct
   - Check bot permissions
   - Verify command structure

3. **Database errors**
   - Check file permissions
   - Ensure database file is writable
   - Backup and recreate if corrupted

### Debug Mode

Enable debug logging:

```env
LOG_LEVEL=debug
NODE_ENV=development
```

## 📞 Support

For deployment issues:
1. Check the logs in `logs/` directory
2. Verify environment variables
3. Test locally first
4. Open an issue on GitHub 