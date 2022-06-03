export function sdkUtilsMulticall(): string {
  return 'sdk-utils-multicall';
}

/**
 * MyType extends a `thing` that does some `stuff`
 */
export interface MyType {
  // the value of choice
  myValue: string;
}

/**
 * do stuff is a great function
 */
export async function doStuff(input: unknown): Promise<MyType> {
  return {
    myValue: String(input),
  };
}
