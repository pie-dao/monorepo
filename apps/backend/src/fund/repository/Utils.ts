import { Filter } from '@domain/feature-funds';
import { QueryOptions } from 'mongoose';

export const toMongooseOptions = ({ limit, orderBy }: Filter): QueryOptions => {
  const sort: Record<string, number> = {};
  Object.keys(orderBy).forEach((key) => {
    sort[key] = orderBy[key] === 'asc' ? 1 : -1;
  });
  return { limit, sort };
};
