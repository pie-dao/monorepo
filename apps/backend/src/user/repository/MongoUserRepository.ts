import { DEFAULT_ENTITY_OPTIONS } from '@domain/feature-funds';
import {
  RawUserEvent,
  User,
  UserFilters,
  UserKeys,
  UserRepository,
} from '@domain/user';
import { Injectable } from '@nestjs/common';
import {
  DatabaseError,
  DefaultFiltersKey,
  EntityNotFoundError,
} from '@shared/util-types';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { HydratedDocument, Model } from 'mongoose';
import { makeFind, makeFindOne, makeSave } from '../../fund';
import { RawUserEventEntity, UserEntity } from './entity';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    private readonly model: Model<UserEntity>,
    private readonly rawEventModel: Model<RawUserEventEntity>,
  ) {}

  find(filters: UserFilters = {}): T.Task<User[]> {
    return makeFind({
      defaultFilter: DEFAULT_ENTITY_OPTIONS,
      model: this.model,
      getPaths: () => this.getPaths(),
      toDomainObject: (record: HydratedDocument<UserEntity>) =>
        this.toDomainObject(record),
    })(filters);
  }

  findOne(
    keys: UserKeys,
    childFilters: UserFilters = {},
  ): TE.TaskEither<EntityNotFoundError | DatabaseError, User> {
    return makeFindOne({
      model: this.model,
      getPaths: () => this.getPaths(),
      toDomainObject: (record: HydratedDocument<UserEntity>) =>
        this.toDomainObject(record),
    })(keys, childFilters);
  }

  save(entity: User): TE.TaskEither<DatabaseError, User> {
    return makeSave({
      model: this.model,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      saveChildren: (user: User, record: HydratedDocument<UserEntity>) => {
        return Promise.all(
          user.rawUserEvents.map((rawEvent) => {
            return new this.rawEventModel(rawEvent).save();
          }),
        );
      },
      toDomainObject: (record: HydratedDocument<UserEntity>) =>
        this.toDomainObject(record),
    })(entity);
  }

  addRawEvent(
    userId: string,
    rawEvent: RawUserEvent,
  ): TE.TaskEither<DatabaseError, void> {
    return pipe(
      this.findOne({ id: userId }),
      TE.chain(() => {
        return TE.tryCatch(
          () => {
            return new this.rawEventModel(rawEvent).save();
          },
          (err: unknown) => new DatabaseError(err),
        );
      }),
      TE.map(() => undefined),
    );
  }

  private getPaths(): Array<Omit<keyof UserFilters, DefaultFiltersKey>> {
    return ['rawUserEvents'];
  }

  private toDomainObject(record: HydratedDocument<UserEntity>): User {
    return {
      id: record.id.toString(),
      name: record.name,
      rawUserEvents: record.rawUserEvents.map((e) => ({
        userId: e.userId,
        payload: e.payload,
        kind: e.kind,
      })),
    };
  }
}
