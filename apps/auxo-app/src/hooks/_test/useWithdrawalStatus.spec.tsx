import { renderHook } from "@testing-library/react-hooks";
import { vaults } from "../../store/vault/auxoVaults";
import { Vault } from "../../store/vault/Vault";
import { toBalance } from "../../utils";
import { zeroBalance } from "../../utils/balances";
import { mockWrap } from "../../utils/testUtils";
import { useSelectedVault } from "../useSelectedVault";
import { useStatus, WITHDRAWAL } from "../useWithdrawalStatus";

jest.mock("../useSelectedVault", () => ({
  useSelectedVault: jest.fn(),
}));

const mockUseSelectedVault = mockWrap(useSelectedVault);

describe("Testing withdrawalStatuses", () => {
  const getMockVault = (): Vault => ({
    ...vaults[0],
    stats: {
      batchBurnRound: 0,
      currentAPY: zeroBalance(),
      deposits: zeroBalance(),
      exchangeRate: zeroBalance(),
      lastHarvest: 0,
    },
    userBalances: {
      wallet: zeroBalance(),
      allowance: zeroBalance(),
      vault: zeroBalance(),
      vaultUnderlying: zeroBalance(),
      batchBurn: {
        round: 0,
        available: zeroBalance(),
        shares: zeroBalance(),
      },
    },
  });

  beforeEach(() => jest.resetAllMocks());

  it("if round is = 0, withdrawal not started", () => {
    const mockVault = getMockVault();
    mockUseSelectedVault.mockReturnValue(mockVault);
    const { result } = renderHook(() => useStatus());
    expect(result.current).toEqual(WITHDRAWAL.NOTSTARTED);
  });

  it("if shares is = 0, withdrawal requested", () => {
    const mockVault = getMockVault();
    mockVault.userBalances!.batchBurn.round = 2;
    mockVault.stats!.batchBurnRound = 1;
    mockUseSelectedVault.mockReturnValue(mockVault);
    const { result } = renderHook(() => useStatus());
    expect(result.current).toEqual(WITHDRAWAL.REQUESTED);
  });

  it("if batch burn round <= user bbr, withdrawal requested", () => {
    const mockVault = getMockVault();
    mockVault.userBalances!.batchBurn.round = 1;
    mockVault.stats!.batchBurnRound = 1;
    mockUseSelectedVault.mockReturnValue(mockVault);
    const { result } = renderHook(() => useStatus());
    expect(result.current).toEqual(WITHDRAWAL.REQUESTED);
  });

  it("if batch burn round > user bbr and shares, withdrawal ready", () => {
    const mockVault = getMockVault();
    mockVault.userBalances!.batchBurn.round = 2;
    mockVault.stats!.batchBurnRound = 1;
    mockVault.userBalances!.batchBurn.shares = toBalance(1, 1);
    mockUseSelectedVault.mockReturnValue(mockVault);
    const { result } = renderHook(() => useStatus());
    expect(result.current).toEqual(WITHDRAWAL.REQUESTED);
  });
});
