import { EmbedBuilder, ColorResolvable } from 'discord.js';

export class EmbedUtils {
  static success(title: string, description: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle(`✅ ${title}`)
      .setDescription(description)
      .setTimestamp();
  }

  static error(title: string, description: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle(`❌ ${title}`)
      .setDescription(description)
      .setTimestamp();
  }

  static info(title: string, description: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`ℹ️ ${title}`)
      .setDescription(description)
      .setTimestamp();
  }

  static warning(title: string, description: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor('#ffff00')
      .setTitle(`⚠️ ${title}`)
      .setDescription(description)
      .setTimestamp();
  }

  static custom(color: ColorResolvable, title: string, description: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
  }
} 