// Typescript casting of value to mock value
export const mockWrap = <T extends (...args: any) => any>(input: T) => {
  return input as any as jest.Mock<ReturnType<T>>;
};
