import {
  ClientEvents,
  CreateRoomArgs, IGame,
  JoinRoomArgs,
  PlayerMoveArgs, ServerEvents,
} from 'reversi-types';
import {emitEvent, EventCallback, onEvent} from './socket-client';

const createRoom = (args: CreateRoomArgs) =>
  emitEvent<CreateRoomArgs>(ClientEvents.CREATE_ROOM, args);

const joinedRoom = (args: JoinRoomArgs) =>
  emitEvent<JoinRoomArgs>(ClientEvents.JOINED, args);

const playerMove = (args: PlayerMoveArgs) =>
  emitEvent<PlayerMoveArgs>(ClientEvents.PLAYER_MOVE, args);

const onRoomCreated = (callback: EventCallback<string>) =>
  onEvent<string>(ServerEvents.CreatedRoom, callback);

const onGameUpdated = (callback: EventCallback<IGame>) =>
  onEvent<IGame>(ServerEvents.GameUpdated, callback);

export {createRoom, joinedRoom, playerMove, onRoomCreated, onGameUpdated};
