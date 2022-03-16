import { act, renderHook } from "@testing-library/react-hooks";
import { useIsCorrectNetwork } from "../useIsCurrentNetwork";
import { useWeb3Cache } from "../useCachedWeb3";
import { vaults as MockVaults } from "../../store/vault/auxoVaults";
import { mockWrap } from "../../utils/testUtils";

jest.mock("../../store", () => ({
  useProxySelector: () => MockVaults[0],
}));

jest.mock("../useCachedWeb3", () => ({
  useWeb3Cache: jest.fn(),
}));

const mockUseWeb3Cache = mockWrap(useWeb3Cache);

describe("testing fetching current network", () => {
  it("Returns false if the chain id is mismatched", async () => {
    let first;
    mockUseWeb3Cache.mockReturnValue({
      chainId: MockVaults[0].network.chainId + 1,
    });
    await act(async () => {
      const { result } = renderHook(() => useIsCorrectNetwork(""));
      first = result.current;
    });
    expect(first).toEqual(false);
  });

  it("Returns true if chain ids are the same", async () => {
    let first;
    mockUseWeb3Cache.mockReturnValue({
      chainId: MockVaults[0].network.chainId,
    });
    await act(async () => {
      const { result } = renderHook(() => useIsCorrectNetwork(""));
      first = result.current;
    });
    expect(first).toEqual(true);
  });
});
