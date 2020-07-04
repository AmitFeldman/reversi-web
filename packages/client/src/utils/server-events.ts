import {EventCallback, onEvent} from './socket-client';
import {IGame, ServerEvents} from 'reversi-types';

const onRoomCreated = (callback: EventCallback<string>) =>
  onEvent<string>(ServerEvents.CreatedRoom, callback);

const onGameUpdated = (callback: EventCallback<IGame>) =>
  onEvent<IGame>(ServerEvents.GameUpdated, callback);

export {onRoomCreated, onGameUpdated};
