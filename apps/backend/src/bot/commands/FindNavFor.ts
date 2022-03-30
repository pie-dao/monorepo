import { BaseCommandInteraction, Client } from 'discord.js';
import { PiesRepository } from 'src/pies/pies.repository';
import { Command } from './Command';

export const FindNavForPie = (piesRepository: PiesRepository): Command => {
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

      let content: string;
      if (!selectedPie.value) {
        content = 'Please specify a pie';
      } else {
        const pie = await piesRepository.findOneBySymbol(
          selectedPie.value.toString(),
        );

        const nav = pie.history[pie.history.length - 1]?.nav ?? 0.0;

        content = `${pie.name} NAV: ${nav}`;
      }

      await interaction.followUp({
        ephemeral: true,
        content,
      });
    },
  };
};
