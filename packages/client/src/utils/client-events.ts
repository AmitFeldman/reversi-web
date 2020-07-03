import {
  ClientEvents,
  CreateRoomArgs,
  JoinRoomArgs,
  PlayerMoveArgs,
} from 'reversi-types';
import {emitEvent} from './socket-client';

const emitCreateRoom = (args: CreateRoomArgs) =>
  emitEvent<CreateRoomArgs>(ClientEvents.CREATE_ROOM, args);

const emitJoinedRoom = (args: JoinRoomArgs) =>
  emitEvent<JoinRoomArgs>(ClientEvents.JOINED, args);

const emitPlayerMove = (args: PlayerMoveArgs) =>
  emitEvent<PlayerMoveArgs>(ClientEvents.PLAYER_MOVE, args);

export {emitCreateRoom, emitJoinedRoom, emitPlayerMove};
