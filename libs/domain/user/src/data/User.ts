import { RawUserEvent } from './RawUserEvent';

export type User = {
  id: string;
  name: string;
  rawUserEvents: RawUserEvent[];
};
