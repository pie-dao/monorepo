import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import {
  BaseCommandInteraction,
  CategoryChannel,
  Client,
  Interaction,
} from 'discord.js';
import { basename } from 'path';
import { PieRepository } from 'src/pies/pies.repository';
import { Command } from './commands/Command';
import { FindNavForPie } from './commands/FindNavFor';

const PIE_BOT_CATEGORY = 'Pie NAVs';
const CATEGORY_TYPE = 'GUILD_CATEGORY';
const VOICE_CHANNEL_TYPE = 'GUILD_VOICE';
const EVERY_HOUR = 1000 * 60 * 60;

@Injectable()
export class BotService {
  private token = process.env.DISCORD_TOKEN;
  private readonly logger = new Logger(BotService.name);
  private commands = [] as Command[];

  private client = new Client({
    intents: [],
  });

  constructor(private pieRepository: PieRepository) {
    this.commands.push(FindNavForPie(pieRepository));
    this.onReady();
    this.onInteractionCreate();
    this.initialize();
  }

  @Interval(EVERY_HOUR)
  public async updateNAVChannels(): Promise<void> {
    const pies = await this.pieRepository.findAll();
    const guilds = await this.client.guilds.fetch();
    for (const [id] of guilds.entries()) {
      const guild = await this.client.guilds.fetch(id);
      // 👇 we need this otherwise guild.roles.everyone is undefined
      await guild.roles.fetch();
      const channels = await guild.channels.fetch();
      let pieCategory = channels.find(
        (channel) =>
          channel.name === PIE_BOT_CATEGORY && channel.type === CATEGORY_TYPE,
      ) as CategoryChannel | undefined;
      if (pieCategory === undefined) {
        pieCategory = await guild.channels.create(PIE_BOT_CATEGORY, {
          type: CATEGORY_TYPE,
          permissionOverwrites: [
            {
              type: 'role',
              id: guild.roles.everyone.id,
              deny: ['SEND_MESSAGES', 'CONNECT'],
            },
          ],
        });
      }
      const existingChannels = channels.filter(
        (channel) =>
          channel.type === VOICE_CHANNEL_TYPE &&
          channel.parentId === pieCategory.id,
      );
      for (const pie of pies) {
        const pieChannel = existingChannels.find((ec) =>
          ec.name.startsWith(pie.symbol),
        );
        const lastNav =
          pie.history[pie.history.length - 1]?.nav?.toFixed(3) ?? 0.0;
        const channelName = `${pie.symbol}: ${lastNav}`;
        if (pieChannel) {
          pieChannel.edit({
            name: channelName,
          });
        } else {
          await guild.channels.create(channelName, {
            type: VOICE_CHANNEL_TYPE,
            parent: pieCategory,
          });
        }
      }
    }
  }

  public async initialize() {
    await this.client.login(this.token);
  }

  private onReady() {
    this.client.on('ready', async () => {
      if (!this.client.user || !this.client.application) {
        return;
      }
      await this.client.application.commands.set(this.commands);
      this.logger.log(`${this.client.user.username} is online`);
    });
  }

  private onInteractionCreate() {
    this.client.on('interactionCreate', async (interaction: Interaction) => {
      if (interaction.isCommand() || interaction.isContextMenu()) {
        await this.handleSlashCommand(interaction);
      }
    });
  }

  private async handleSlashCommand(interaction: BaseCommandInteraction) {
    const slashCommand = this.commands.find(
      (c) => c.name === interaction.commandName,
    );
    if (!slashCommand) {
      interaction.followUp({ content: 'An error has occurred' });
      return;
    }

    await interaction.deferReply();

    slashCommand.run(this.client, interaction);
  }
}
