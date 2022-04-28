import React from "react";
import { setImmediate, clearImmediate } from "timers";
import { render, waitFor } from "@testing-library/react";
import { generateTestingUtils } from "eth-testing";
import { ChainSwitcher } from "./ChainSwitcher";
import * as chainIdUtils from "../test-utils/network";
import { Web3ReactProvider } from "@web3-react/core";
import {
  click,
  getNetworkSwitcherOptions,
  getNetworkSwitcherButton,
  assertListboxButton,
  NetworkSwitcherState,
} from "../test-utils/interactions";

jest.mock("../hooks/use-id");
jest.mock("../hooks/use-connected-wallet");
jest.mock("@web3-react/core", () => {
  return {
    ...jest.requireActual("@web3-react/core"),
    useWeb3React: jest.fn().mockReturnValue({
      active: true,
      error: undefined,
      account: "0xFoo",
      chainId: 1,
      activate: jest.fn(),
      deactivate: jest.fn(),
      setError: jest.fn(),
    }),
  };
});

const metaMaskTestingUtils = generateTestingUtils({ providerType: "MetaMask" });

let originalEth: unknown;

beforeAll(() => {
  originalEth = global.window.ethereum;
  // @ts-expect-error
  window.ethereum = metaMaskTestingUtils.getProvider();

  jest
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation(setImmediate as any);
  jest
    .spyOn(window, "cancelAnimationFrame")
    .mockImplementation(clearImmediate as any);
});

afterAll(() => jest.restoreAllMocks());

describe("Rendering", () => {
  describe("NetworkSwitcher", () => {
    it("should be possible to switch chain", async () => {
      function Example() {
        return (
          <Web3ReactProvider getLibrary={chainIdUtils.getLibrary}>
            <ChainSwitcher allowedChains={["MAINNET", "POLYGON", "FANTOM"]} />
          </Web3ReactProvider>
        );
      }
      render(<Example />);
      await waitFor(() => click(getNetworkSwitcherButton()));
      let options = getNetworkSwitcherOptions();
      await waitFor(() => click(options[1]));

      assertListboxButton({
        state: NetworkSwitcherState.InvisibleHidden,
        textContent: "Polygon Mainnet",
      });
    });
  });
});
