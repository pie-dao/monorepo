export type Operation = '$eq' | '$gt' | '$gte' | '$in' | '$lt' | '$lte' | '$ne';

/**
 * Options to be passed to queries.
 */
export type Options<O extends string = '_id', F extends string = '_id'> = {
  limit?: number;
  orderBy?: Partial<Record<O, 'asc' | 'desc'>>;
  filter?: Partial<Record<F, Partial<Record<Operation, unknown>>>>;
};
