import { ChatInputCommandInteraction, PermissionFlagsBits, GuildMember } from 'discord.js';

export class PermissionUtils {
  static async checkPermissions(
    interaction: ChatInputCommandInteraction,
    requiredPermissions: bigint[]
  ): Promise<boolean> {
    if (!interaction.guild || !interaction.member) {
      return false;
    }

    const member = interaction.member as GuildMember;
    
    // Check if user has administrator permissions
    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      return true;
    }

    // Check for specific required permissions
    for (const permission of requiredPermissions) {
      if (!member.permissions.has(permission)) {
        return false;
      }
    }

    return true;
  }

  static async requirePermissions(
    interaction: ChatInputCommandInteraction,
    requiredPermissions: bigint[],
    errorMessage: string = 'You do not have the required permissions to use this command.'
  ): Promise<boolean> {
    const hasPermissions = await this.checkPermissions(interaction, requiredPermissions);
    
    if (!hasPermissions) {
      await interaction.reply({
        content: errorMessage,
        ephemeral: true
      });
    }

    return hasPermissions;
  }

  static getPermissionNames(permissions: bigint[]): string[] {
    const permissionNames: string[] = [];
    
    for (const permission of permissions) {
      switch (permission) {
        case PermissionFlagsBits.ManageGuild:
          permissionNames.push('Manage Server');
          break;
        case PermissionFlagsBits.ManageChannels:
          permissionNames.push('Manage Channels');
          break;
        case PermissionFlagsBits.ManageRoles:
          permissionNames.push('Manage Roles');
          break;
        case PermissionFlagsBits.KickMembers:
          permissionNames.push('Kick Members');
          break;
        case PermissionFlagsBits.BanMembers:
          permissionNames.push('Ban Members');
          break;
        case PermissionFlagsBits.ManageMessages:
          permissionNames.push('Manage Messages');
          break;
        case PermissionFlagsBits.EmbedLinks:
          permissionNames.push('Embed Links');
          break;
        case PermissionFlagsBits.AttachFiles:
          permissionNames.push('Attach Files');
          break;
        case PermissionFlagsBits.ReadMessageHistory:
          permissionNames.push('Read Message History');
          break;
        case PermissionFlagsBits.UseExternalEmojis:
          permissionNames.push('Use External Emojis');
          break;
        default:
          permissionNames.push('Unknown Permission');
      }
    }

    return permissionNames;
  }
} 