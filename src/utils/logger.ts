import winston from 'winston';
import chalk from 'chalk';

export class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env['LOG_LEVEL'] || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'discord-bot' },
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });

    // Add console transport for development
    if (process.env['NODE_ENV'] !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
          winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const time = new Date(timestamp as string | number | Date).toLocaleTimeString();
            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
            return `${chalk.gray(time)} ${chalk.cyan('BOT')} ${level}: ${message}${metaStr}`;
          })
        )
      }));
    }
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  error(message: string, error?: any): void {
    this.logger.error(message, error);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  // Specialized logging methods
  command(name: string, userId: string, guildId?: string): void {
    this.info(`Command executed: ${name}`, { userId, guildId });
  }

  event(name: string, meta?: any): void {
    this.info(`Event triggered: ${name}`, meta);
  }

  database(operation: string, table: string, meta?: any): void {
    this.debug(`Database ${operation} on ${table}`, meta);
  }
}
