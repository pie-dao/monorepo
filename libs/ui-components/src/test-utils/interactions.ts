import { fireEvent } from "@testing-library/react";
import { setImmediate } from "timers";

function nextFrame(cb: Function): void {
  setImmediate(() =>
    setImmediate(() => {
      cb();
    })
  );
}

export enum MouseButton {
  Left = 0,
  Right = 2,
}

export async function click(
  element: Document | Element | Window | Node | null,
  button = MouseButton.Left
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

// Credit:
//  - https://stackoverflow.com/a/30753870
let focusableSelector = [
  "[contentEditable=true]",
  "[tabindex]",
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "iframe",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
]
  .map(
    process.env.NODE_ENV === "test"
      ? // TODO: Remove this once JSDOM fixes the issue where an element that is
        // "hidden" can be the document.activeElement, because this is not possible
        // in real browsers.
        (selector) =>
          `${selector}:not([tabindex='-1']):not([style*='display: none'])`
      : (selector) => `${selector}:not([tabindex='-1'])`
  )
  .join(",");
