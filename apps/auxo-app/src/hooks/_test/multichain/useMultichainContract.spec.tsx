import { renderHook } from "@testing-library/react-hooks";
import { ethers } from "ethers";
import {
  getMulticallProvider,
  getProviderOrSigner,
  useAuxoVaultContract,
  useMerkleAuthContract,
  useTokenContract,
} from "../../multichain/useMultichainContract";

const TEST_ACCOUNT = "0x63BCe354DBA7d6270Cb34dAA46B869892AbB3A79";

const mockLib = new ethers.providers.JsonRpcProvider();
jest.mock("@web3-react/core", () => ({
  useWeb3React: () => ({
    library: mockLib,
    account: TEST_ACCOUNT,
    active: true,
    activate: jest.fn(),
    deactivate: jest.fn(),
    setError: jest.fn(),
  }),
}));

describe("Testing using the multichain provider switcher", () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const defaultMulticall = "0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E";
  it("Adds the multichain contract to the provider if passed", () => {
    const multicallProvider = getMulticallProvider(provider, "test");
    // @ts-ignore
    expect(multicallProvider.multicall.options.contract).toEqual("test");
  });

  it("Otherwise uses the fallback", () => {
    const multicallProvider = getMulticallProvider(provider);
    // @ts-ignore
    expect(multicallProvider.multicall.options.contract).toEqual(
      defaultMulticall
    );
  });

  it("Gets a signer if an account is passed", () => {
    const providerSigner = getProviderOrSigner(provider, TEST_ACCOUNT);
    // @ts-ignore
    expect(providerSigner._isSigner).toBe(true);
  });

  it("otherwise gets multicall", () => {
    const providerSigner = getProviderOrSigner(provider);
    // @ts-ignore
    expect(providerSigner.multicall.options.contract).toEqual(defaultMulticall);
  });
});

describe("Getting contracts", () => {
  it("Fetches auxo", () => {
    const { result } = renderHook(() => useAuxoVaultContract("auxo"));
    const contract = result.current;
    expect(contract.execBatchBurn).toBeTruthy();
  });

  it("Fetches token", () => {
    const { result } = renderHook(() => useTokenContract("token"));
    const contract = result.current;
    expect(contract.approve).toBeTruthy();
  });

  it("Fetches auth", () => {
    const { result } = renderHook(() => useMerkleAuthContract("auth"));
    const contract = result.current;
    expect(contract.authorizeDepositor).toBeTruthy();
  });
});
