import { Filter } from './Filter';

export const DEFAULT_FILTERS_KEY = 'entity';

export type DefaultFiltersKey = typeof DEFAULT_FILTERS_KEY;

export type Filters<F extends string | DefaultFiltersKey = DefaultFiltersKey> =
  Partial<Record<F, Filter>>;
