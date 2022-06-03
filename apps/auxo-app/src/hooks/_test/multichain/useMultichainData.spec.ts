import { vaults } from '../../../store/vault/auxoVaults';
import { Vault } from '../../../store/vault/Vault';
import { SUPPORTED_CHAINS } from '../../../utils/networks';
import {
  getRefreshFrequency,
  hasStateChanged,
} from '../../multichain/useMultiChainData';

describe('Testing the refresh frequency hook', () => {
  it('correctly sets the refresh frequency for differnt block times', () => {
    const expectedFTM = 60;
    const expectPolygon = Math.round(60 / 1.5);

    const refreshFTM = getRefreshFrequency(SUPPORTED_CHAINS.FANTOM);
    const refreshPolygon = getRefreshFrequency(SUPPORTED_CHAINS.POLYGON);

    expect(refreshFTM).toEqual(expectedFTM);
    expect(refreshPolygon).toEqual(expectPolygon);
  });
});

describe('State change updates', () => {
  it('Does not update if the state hash is equal', () => {
    const old: Vault[] = vaults;
    const _new: Vault[] = JSON.parse(JSON.stringify(vaults));
    expect(hasStateChanged(old, _new)).toEqual(false);
  });

  it('Does updates if the state hash is not equal', () => {
    const old: Vault[] = vaults;
    const _new: Vault[] = JSON.parse(JSON.stringify(vaults));
    _new[0].name = 'some new data';
    expect(hasStateChanged(old, _new)).toEqual(true);
  });
});
