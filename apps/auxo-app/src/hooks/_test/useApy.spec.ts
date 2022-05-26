import { vaults } from '../../store/vault/auxoVaults';
import { Vault, VaultStats } from '../../store/vault/Vault';
import { useApy } from '../useApy';

describe('testing apy', () => {
  let vault: Vault;
  beforeEach(() => {
    vault = vaults[0];
    vault.stats = {} as VaultStats;
  });
  it('returns apy ', () => {
    vault.stats!.currentAPY = {
      label: 22.34,
      value: '223445556',
    };
    const apy = useApy(vault);
    expect(apy).toEqual('22.34 %');
  });

  it('else returns new vault', () => {
    vault.stats!.currentAPY = {
      label: 0,
      value: '0',
    };
    const apy = useApy(vault);
    expect(apy).toEqual('New Vault');
  });

  it('if missing no value', () => {
    let apy = useApy(undefined);
    expect(apy).toEqual('--');
    vault.stats = undefined;
    apy = useApy(vault);
  });
});
