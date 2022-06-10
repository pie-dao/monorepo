import * as t from 'io-ts';

export const optional = <T extends t.Mixed>(type: T) =>
  t.union([type, t.undefined]);

export const nullable = <T extends t.Mixed>(type: T) => t.union([type, t.null]);
