import { Options } from './Options';

export const DEFAULT_FILTERS_KEY = 'entity';

export type DefaultFiltersKey = typeof DEFAULT_FILTERS_KEY;

export type QueryOptions<
  F extends string | DefaultFiltersKey = DefaultFiltersKey,
> = Partial<Record<F, Options>>;
