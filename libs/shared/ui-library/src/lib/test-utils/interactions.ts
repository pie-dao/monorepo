import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { setImmediate } from 'timers';
import { disposables } from '../utils/disposables';

let d = disposables();

function nextFrame(cb: Function): void {
  setImmediate(() =>
    setImmediate(() => {
      cb();
    }),
  );
}

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}

export let Keys: Record<string, Partial<KeyboardEvent>> = {
  Space: { key: ' ', keyCode: 32, charCode: 32 },
  Enter: { key: 'Enter', keyCode: 13, charCode: 13 },
  Escape: { key: 'Escape', keyCode: 27, charCode: 27 },
  Backspace: { key: 'Backspace', keyCode: 8 },

  ArrowLeft: { key: 'ArrowLeft', keyCode: 37 },
  ArrowUp: { key: 'ArrowUp', keyCode: 38 },
  ArrowRight: { key: 'ArrowRight', keyCode: 39 },
  ArrowDown: { key: 'ArrowDown', keyCode: 40 },

  Home: { key: 'Home', keyCode: 36 },
  End: { key: 'End', keyCode: 35 },

  PageUp: { key: 'PageUp', keyCode: 33 },
  PageDown: { key: 'PageDown', keyCode: 34 },

  Tab: { key: 'Tab', keyCode: 9, charCode: 9 },
};

export enum MouseButton {
  Left = 0,
  Right = 2,
}

export enum NetworkSwitcherState {
  Visible,
  InvisibleHidden,
  InvisibleUnmounted,
}

let Default = Symbol();
let Ignore = Symbol();

let order: Record<
  string | typeof Default,
  ((
    element: Element,
    event: Partial<KeyboardEvent | MouseEvent>,
  ) => boolean | typeof Ignore | Element)[]
> = {
  [Default]: [
    function keydown(element, event) {
      return fireEvent.keyDown(element, event);
    },
    function keypress(element, event) {
      return fireEvent.keyPress(element, event);
    },
    function input(element, event) {
      // TODO: This should only fire when the element's value changes
      return fireEvent.input(element, event);
    },
    function keyup(element, event) {
      return fireEvent.keyUp(element, event);
    },
  ],
  [Keys.Enter.key!]: [
    function keydown(element, event) {
      return fireEvent.keyDown(element, event);
    },
    function keypress(element, event) {
      return fireEvent.keyPress(element, event);
    },
    function click(element, event) {
      if (element instanceof HTMLButtonElement)
        return fireEvent.click(element, event);
      return Ignore;
    },
    function keyup(element, event) {
      return fireEvent.keyUp(element, event);
    },
  ],
  [Keys.Space.key!]: [
    function keydown(element, event) {
      return fireEvent.keyDown(element, event);
    },
    function keypress(element, event) {
      return fireEvent.keyPress(element, event);
    },
    function keyup(element, event) {
      return fireEvent.keyUp(element, event);
    },
    function click(element, event) {
      if (element instanceof HTMLButtonElement)
        return fireEvent.click(element, event);
      return Ignore;
    },
  ],
  [Keys.Tab.key!]: [
    function keydown(element, event) {
      return fireEvent.keyDown(element, event);
    },
    function blurAndfocus(_element, event) {
      return focusNext(event);
    },
    function keyup(element, event) {
      return fireEvent.keyUp(element, event);
    },
  ],
  [Keys.Escape.key!]: [
    function keydown(element, event) {
      return fireEvent.keyDown(element, event);
    },
    function keypress(element, event) {
      return fireEvent.keyPress(element, event);
    },
    function keyup(element, event) {
      return fireEvent.keyUp(element, event);
    },
  ],
};

let cancellations: Record<
  string | typeof Default,
  Record<string, Set<string>>
> = {
  [Default]: {
    keydown: new Set(['keypress']),
    keypress: new Set([]),
    keyup: new Set([]),
  },
  [Keys.Enter.key!]: {
    keydown: new Set(['keypress', 'click']),
    keypress: new Set(['click']),
    keyup: new Set([]),
  },
  [Keys.Space.key!]: {
    keydown: new Set(['keypress', 'click']),
    keypress: new Set([]),
    keyup: new Set(['click']),
  },
  [Keys.Tab.key!]: {
    keydown: new Set(['keypress', 'blur', 'focus']),
    keypress: new Set([]),
    keyup: new Set([]),
  },
};

export async function type(
  events: Partial<KeyboardEvent>[],
  element = document.activeElement,
) {
  jest.useFakeTimers();

  try {
    if (element === null) return expect(element).not.toBe(null);

    for (let event of events) {
      let skip = new Set();
      let actions = order[event.key!] ?? order[Default as any];
      for (let action of actions) {
        let checks = action.name.split('And');
        if (checks.some((check) => skip.has(check))) continue;

        let result = action(element, {
          type: action.name,
          charCode:
            event.key?.length === 1 ? event.key?.charCodeAt(0) : undefined,
          ...event,
        });
        if (result === Ignore) continue;
        if (result instanceof Element) {
          element = result;
        }

        let cancelled = !result;
        if (cancelled) {
          let skippablesForKey =
            cancellations[event.key!] ?? cancellations[Default as any];
          let skippables = skippablesForKey?.[action.name] ?? new Set();

          for (let skippable of skippables) skip.add(skippable);
        }
      }
    }

    // We don't want to actually wait in our tests, so let's advance
    jest.runAllTimers();

    await d.workQueue();

    await new Promise(nextFrame);
  } catch (err) {
    if (err instanceof Error) Error.captureStackTrace(err, type);
    throw err;
  } finally {
    jest.useRealTimers();
  }
}

export async function click(
  element: Document | Element | Window | Node | null,
  button = MouseButton.Left,
) {
  try {
    if (element === null) return expect(element).not.toBe(null);

    let options = { button };

    if (button === MouseButton.Left) {
      // Cancel in pointerDown cancels mouseDown, mouseUp
      let cancelled = !fireEvent.pointerDown(element, options);
      if (!cancelled) {
        fireEvent.mouseDown(element, options);
      }

      // Ensure to trigger a `focus` event if the element is focusable, or within a focusable element
      let next: HTMLElement | null = element as HTMLElement | null;
      while (next !== null) {
        if (next.matches(focusableSelector)) {
          next.focus();
          break;
        }
        next = next.parentElement;
      }

      fireEvent.pointerUp(element, options);
      if (!cancelled) {
        fireEvent.mouseUp(element, options);
      }
      fireEvent.click(element, options);
    } else if (button === MouseButton.Right) {
      // Cancel in pointerDown cancels mouseDown, mouseUp
      let cancelled = !fireEvent.pointerDown(element, options);
      if (!cancelled) {
        fireEvent.mouseDown(element, options);
      }

      // Only in Firefox:
      fireEvent.pointerUp(element, options);
      if (!cancelled) {
        fireEvent.mouseUp(element, options);
      }
    }

    await new Promise(nextFrame);
  } catch (err) {
    if (err instanceof Error) Error.captureStackTrace(err, click);
    throw err;
  }
}

export async function press(
  event: Partial<KeyboardEvent>,
  element = document.activeElement,
) {
  return type([event], element);
}

function focusNext(event: Partial<KeyboardEvent>) {
  let direction = event.shiftKey ? -1 : +1;
  let focusableElements = getFocusableElements();
  let total = focusableElements.length;

  function innerFocusNext(offset = 0): Element {
    let currentIdx = focusableElements.indexOf(
      document.activeElement as HTMLElement,
    );
    let next = focusableElements[
      (currentIdx + total + direction + offset) % total
    ] as HTMLElement;

    if (next) next?.focus({ preventScroll: true });

    if (next !== document.activeElement)
      return innerFocusNext(offset + direction);
    return next;
  }

  return innerFocusNext();
}

// Credit:
//  - https://stackoverflow.com/a/30753870
let focusableSelector = [
  '[contentEditable=true]',
  '[tabindex]',
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'iframe',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
]
  .map(
    process.env.NODE_ENV === 'test'
      ? // TODO: Remove this once JSDOM fixes the issue where an element that is
        // "hidden" can be the document.activeElement, because this is not possible
        // in real browsers.
        (selector) =>
          `${selector}:not([tabindex='-1']):not([style*='display: none'])`
      : (selector) => `${selector}:not([tabindex='-1'])`,
  )
  .join(',');

export async function mouseMove(element: Document | Element | Window | null) {
  try {
    if (element === null) return expect(element).not.toBe(null);

    fireEvent.pointerMove(element);
    fireEvent.mouseMove(element);

    await new Promise(nextFrame);
  } catch (err) {
    if (err instanceof Error) Error.captureStackTrace(err, mouseMove);
    throw err;
  }
}

// Selectors

export function getNetworkSwitcher(): HTMLElement | null {
  return document.querySelector('[role="networkSwitcher"]');
}

export function getNetworkSwitcherLabel(): HTMLElement | null {
  return document.querySelector('label,[id^="networkSwitcher-label"]');
}

export function getNetworkSwitcherButton(): HTMLElement | null {
  return document.querySelector(
    'button,[role="button"],[id^="networkSwitcher-button-"]',
  );
}

export function getNetworkSwitcherOptions(): HTMLElement[] {
  return Array.from(document.querySelectorAll('[role="option"]'));
}

export function getConnectButton(): HTMLElement | null {
  return document.querySelector('button,[role="button"],[id="connect-button"]');
}

export function getConnectMetamaskButton(): HTMLElement | null {
  return document.querySelector(
    'button,[role="button"],[id="piedao-metamask-connect-button"]',
  );
}

function getFocusableElements(container = document.body) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(focusableSelector));
}

export function assertActiveNetworkSwticherOption(
  item: HTMLElement | null,
  networkSwitcher = getNetworkSwitcher(),
) {
  try {
    if (networkSwitcher === null) return expect(networkSwitcher).not.toBe(null);
    if (item === null) return expect(item).not.toBe(null);

    // Ensure link between networkSwticher & networkSwticher item is correct
    expect(networkSwitcher).toHaveAttribute(
      'aria-activedescendant',
      item.getAttribute('id'),
    );
  } catch (err) {
    if (err instanceof Error)
      Error.captureStackTrace(err, assertActiveNetworkSwticherOption);
    throw err;
  }
}

export function assertNetworkSwitcherButton(
  options: {
    attributes?: Record<string, string | null>;
    textContent?: string;
    state: NetworkSwitcherState;
  },
  button = getNetworkSwitcherButton(),
) {
  try {
    if (button === null) return expect(button).not.toBe(null);

    // Ensure menu button have these properties
    expect(button).toHaveAttribute('id');
    expect(button).toHaveAttribute('aria-haspopup');

    switch (options.state) {
      case NetworkSwitcherState.Visible:
        expect(button).toHaveAttribute('aria-controls');
        expect(button).toHaveAttribute('aria-expanded', 'true');
        break;

      case NetworkSwitcherState.InvisibleHidden:
        expect(button).toHaveAttribute('aria-controls');
        if (button.hasAttribute('disabled')) {
          expect(button).not.toHaveAttribute('aria-expanded');
        } else {
          expect(button).toHaveAttribute('aria-expanded', 'false');
        }
        break;

      case NetworkSwitcherState.InvisibleUnmounted:
        expect(button).not.toHaveAttribute('aria-controls');
        if (button.hasAttribute('disabled')) {
          expect(button).not.toHaveAttribute('aria-expanded');
        } else {
          expect(button).toHaveAttribute('aria-expanded', 'false');
        }
        break;

      default:
        assertNever(options.state);
    }

    if (options.textContent) {
      expect(button).toHaveTextContent(options.textContent);
    }

    // Ensure menu button has the following attributes
    for (let attributeName in options.attributes) {
      expect(button).toHaveAttribute(
        attributeName,
        options.attributes[attributeName],
      );
    }
  } catch (err) {
    if (err instanceof Error)
      Error.captureStackTrace(err, assertNetworkSwitcherButton);
    throw err;
  }
}

export function assertConnectButton(
  options: {
    textContent: string;
  },
  button = getConnectButton(),
) {
  try {
    if (button === null) return expect(button).not.toBe(null);

    // Ensure connect button have these properties
    expect(button).toHaveAttribute('id');
    expect(button).toHaveTextContent(options.textContent);
  } catch (err) {
    if (err instanceof Error) Error.captureStackTrace(err, assertConnectButton);
    throw err;
  }
}
