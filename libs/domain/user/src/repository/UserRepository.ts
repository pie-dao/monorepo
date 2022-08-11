import {
  DatabaseError,
  DefaultFiltersKey,
  QueryOptions,
  Repository,
} from '@shared/util-types';
import * as TE from 'fp-ts/TaskEither';
import { RawUserEvent, User } from '../data';

export type UserFilterField = DefaultFiltersKey | 'rawUserEvents';

export type UserFilters = QueryOptions<UserFilterField>;

export type UserKeys = { id: string };

export interface UserRepository
  extends Repository<UserKeys, User, UserFilters> {
  addRawEvent(
    userId: string,
    rawEvent: RawUserEvent,
  ): TE.TaskEither<DatabaseError, void>;
}
