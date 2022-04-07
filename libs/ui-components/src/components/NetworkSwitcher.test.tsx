import React, { createElement } from "react";
import { setImmediate, clearImmediate } from "timers";
import { render } from "@testing-library/react";
import { NetworkSwitcher } from "./NetworkSwitcher";
import { chainMap } from "../utils/network";

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
