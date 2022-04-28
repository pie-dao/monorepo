import React, { createElement, useState } from "react";
import { setImmediate, clearImmediate } from "timers";
import { render, screen } from "@testing-library/react";
import { generateTestingUtils } from "eth-testing";
import { ethers } from "ethers";
import { NetworkSwitcher } from "./NetworkSwitcher";
import * as chainIdUtils from "../test-utils/network";
import { chainMap } from "../utils/network";
import { Web3ReactProvider } from "@web3-react/core";
import { suppressConsoleLogs } from "../test-utils/suppress-console-logs";
import {
  click,
  getNetworkSwitcherOptions,
  getNetworkSwitcherButton,
  mouseMove,
  Keys,
  press,
} from "../test-utils/interactions";

jest.mock("../hooks/use-id");

const metaMaskTestingUtils = generateTestingUtils({ providerType: "MetaMask" });
const readTestingUtils = generateTestingUtils();
const mainNetTestingUtils = generateTestingUtils();

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

describe("safeguards", () => {
  it.each([
    ["NetworkSwitcher.Button", NetworkSwitcher.Button],
    ["NetworkSwitcher.Label", NetworkSwitcher.Label],
    ["NetworkSwitcher.Options", NetworkSwitcher.Options],
    ["NetworkSwitcher.Option", NetworkSwitcher.Option],
  ])(
    "should error when we are using a <%s /> without a parent <NetworkSwitcher />",
    suppressConsoleLogs((name, Component) => {
      // @ts-expect-error This is fine
      expect(() => render(createElement(Component))).toThrowError(
        `<${name} /> is missing a parent <NetworkSwitcher /> component.`
      );
    })
  );

  it(
    "should be possible to render a Listbox without crashing",
    suppressConsoleLogs(async () => {
      render(
        <NetworkSwitcher value={undefined} onChange={console.log}>
          <NetworkSwitcher.Button>Trigger</NetworkSwitcher.Button>
          <NetworkSwitcher.Options>
            <NetworkSwitcher.Option value={chainMap[1]}>
              Option A
            </NetworkSwitcher.Option>
            <NetworkSwitcher.Option value={chainMap[137]}>
              Option B
            </NetworkSwitcher.Option>
            <NetworkSwitcher.Option value={chainMap[250]}>
              Option C
            </NetworkSwitcher.Option>
          </NetworkSwitcher.Options>
        </NetworkSwitcher>
      );
    })
  );
});

describe("Rendering", () => {
  describe("NetworkSwitcher", () => {
    beforeEach(() => {
      mainNetTestingUtils.mockReadonlyProvider();
      readTestingUtils.mockReadonlyProvider({ chainId: "0x1" });

      mainNetTestingUtils.ens.mockAllToEmpty();

      jest
        .spyOn(chainIdUtils, "getChainProvider")
        .mockImplementation((chainId: string) => {
          if (chainId === "0x1")
            return new ethers.providers.Web3Provider(
              mainNetTestingUtils.getProvider() as any
            );
          return new ethers.providers.Web3Provider(
            readTestingUtils.getProvider() as any
          );
        });
    });

    afterEach(() => {
      mainNetTestingUtils.clearAllMocks();
      metaMaskTestingUtils.clearAllMocks();
      readTestingUtils.clearAllMocks();
    });

    it(
      "should be possible to render a Listbox using a render prop",
      suppressConsoleLogs(async () => {
        render(
          <NetworkSwitcher value={undefined} onChange={console.log}>
            {({ open }) => (
              <>
                <NetworkSwitcher.Button>Trigger</NetworkSwitcher.Button>
                {open && (
                  <NetworkSwitcher.Options>
                    <NetworkSwitcher.Option value={chainMap[1]}>
                      Option A
                    </NetworkSwitcher.Option>
                    <NetworkSwitcher.Option value={chainMap[1]}>
                      Option B
                    </NetworkSwitcher.Option>
                    <NetworkSwitcher.Option value={chainMap[1]}>
                      Option C
                    </NetworkSwitcher.Option>
                  </NetworkSwitcher.Options>
                )}
              </>
            )}
          </NetworkSwitcher>
        );
      })
    );
  });
});
