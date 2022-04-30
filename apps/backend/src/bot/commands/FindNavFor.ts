import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';
import { PieRepository } from 'src/pies/repository/PieRepository';
import { Command } from './Command';

const DOUGH_PINK = 0xd60a99;

export const FindNavForPie = (piesRepository: PieRepository): Command => {
  return {
    name: 'nav',
    description: 'Finds a NAV for a pie',
    type: 'CHAT_INPUT',
    options: [
      {
        type: 'STRING',
        choices: [
          { name: 'DEFI+L', value: 'DEFI+L' },
          { name: 'PLAY', value: 'PLAY' },
        ],
        name: 'pie',
        description: 'The name of the pie',
        required: true,
      },
    ],
    async run(_: Client, interaction: BaseCommandInteraction) {
      const selectedPie = interaction.options.get('pie');

      let embed: MessageEmbed;
      if (!selectedPie?.value) {
        embed = new MessageEmbed({
          title: 'No pie selected',
          description: 'Please select a *pie* from the possible choices',
          timestamp: new Date(),
          color: DOUGH_PINK,
        });
      } else {
        console.log(typeof piesRepository);

        const pie = await piesRepository.findOneBySymbol(
          selectedPie.value.toString(),
        );

        const nav = pie.history[pie.history.length - 1]?.nav ?? 0.0;

        embed = new MessageEmbed({
          title: `${pie.name}`,
          description: `
                    💰 **NAV**     👉 ${nav.toFixed(3)}
                    📉 **Discount** 👉 1
                    `,
          timestamp: new Date(),
          color: DOUGH_PINK,
        });
      }

      await interaction.followUp({
        ephemeral: true,
        embeds: [embed],
      });
    },
  };
};
