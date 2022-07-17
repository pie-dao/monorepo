/**
 * Represents a filter that can be used to query records.
 */
export type Filter<F extends string = '_id'> = {
  limit?: number;
  orderBy?: Partial<Record<F, 'asc' | 'desc'>>;
};
