import { renderHook } from "@testing-library/react-hooks";
import { useWindowWide } from "../useWindowWidth";

describe("Testing the window width listener", () => {
  const initalSize = 100;
  it("Returns true if the width is greater than the initial size", () => {
    window.innerWidth = 200;
    const { result } = renderHook(() => useWindowWide(initalSize));
    expect(result.current).toEqual(true);
  });

  it("Returns false when the window shrinks", () => {
    window.innerWidth = 50;
    const { result } = renderHook(() => useWindowWide(initalSize));
    expect(result.current).toEqual(false);
  });
});
