import { UserEvent } from './UserEvent';

export interface RawUserEvent extends UserEvent {
  kind: 'RawUserEvent';
  payload: Record<string, unknown>;
}
