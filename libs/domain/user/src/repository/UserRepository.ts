import {
  DatabaseError,
  DefaultFiltersKey,
  Filters,
  Repository,
} from '@shared/util-types';
import * as TE from 'fp-ts/TaskEither';
import { RawUserEvent, User } from '../data';

export type UserFilterField = DefaultFiltersKey | 'rawUserEvents';

export type UserFilters = Filters<UserFilterField>;

export type UserKeys = { id: string };

export interface UserRepository
  extends Repository<User, UserKeys, UserFilters> {
  addRawEvent(
    userId: string,
    rawEvent: RawUserEvent,
  ): TE.TaskEither<DatabaseError, void>;
}
