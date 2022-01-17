import {PieEntity} from '../../entities/pie.entity';

const pies = [
  {name: "BTC++", address: "0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd", history: []},
  {name: "DEFI+S", address: "0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c", history: []},
  {name: "DEFI++", address: "0x8d1ce361eb68e9e05573443c407d4a3bed23b033", history: []},
  {name: "BCP", address: "0xe4f726adc8e89c6a6017f01eada77865db22da14", history: []},
  {name: "YPIE", address: "0x17525E4f4Af59fbc29551bC4eCe6AB60Ed49CE31", history: []},
  {name: "PLAY", address: "0x33e18a092a93ff21ad04746c7da12e35d34dc7c4", history: []},
  {name: "DEFI+L", address: "0x78f225869c08d478c34e5f645d07a87d3fe8eb78", history: []},
  {name: "USD++", address: "0x9a48bd0ec040ea4f1d3147c025cd4076a2e71e3e", history: []},
  {name: "NOT_EXISTING_PIE", address: "0x0000000000000000000000000000000000000000", history: []}
];

export const PiesStub = (): PieEntity[]  => {
  // returning all pies...
  return pies;
}

export const PieStub = (): PieEntity  => {
  // returning a random pie...
  return pies[0];
}