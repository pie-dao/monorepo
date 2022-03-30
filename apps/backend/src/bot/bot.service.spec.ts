import { BotService } from './bot.service';

describe('BotService', () => {
  let target: BotService;

  beforeEach(async () => {
    target = new BotService();
  });

  describe('Given a Bot Service', () => {
    it('When updating the NAVs Then it should update the Discord servers', async () => {
      await target.init();
      await target.updateNAVChannels([
        {
          nav: 546866,
          name: 'PLAY',
          symbol: 'PLAY',
        },
        {
          nav: 6138,
          name: 'DEFI+L',
          symbol: 'DEFI+L',
        },
      ]);
    });
  });
});
