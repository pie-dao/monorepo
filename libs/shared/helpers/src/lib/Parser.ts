import { Either } from 'fp-ts/Either';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';

export type Validation<A> = Either<NonEmptyArray<string>, A>;

export type Parser<A> = (value: unknown) => Validation<A>;
