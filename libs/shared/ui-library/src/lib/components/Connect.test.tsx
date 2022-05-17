import { createElement } from "react";
import { setImmediate, clearImmediate } from "timers";
import { render } from "@testing-library/react";
import { Connect } from "./Connect";

import { suppressConsoleLogs } from "../test-utils/suppress-console-logs";

jest.mock("../hooks/use-id");

beforeAll(() => {
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
    ["Connect.Overlay", Connect.Overlay],
    ["Connect.Title", Connect.Title],
    ["Connect.MetamaskButton", Connect.MetamaskButton],
    ["Connect.WalletConnectButton", Connect.WalletConnectButton],
    ["Connect.DisconnectButton", Connect.DisconnectButton],
  ])(
    "should error when we are using a <%s /> without a parent <Connect />",
    suppressConsoleLogs((name, Component) => {
      expect(() => render(createElement(Component))).toThrowError(
        `<${name} /> is missing a parent <Connect /> component.`
      );
    })
  );
});
