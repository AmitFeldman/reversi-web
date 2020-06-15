import {Document} from 'mongoose';

// Duplicate of reversi-types package TODO: Fix alias paths

export interface BaseDocument extends Document {
  date: Date;
}

export interface User extends BaseDocument {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
}

// export const EVENT_GAME_CREATED = 'game-created';
// export const EVENT_GAME_JOINED = 'game-joined';
// export const EVENT_STATE_CHANGED = 'game-state-changed';
// export const EVENT_GAME_FINISHED = 'game-finished';

export enum ClientEvents {
  CreateRoom = 'CREATE_ROOM',
  JOINED = 'JOINED',
  PlayerMove = 'PLAYER_MOVE',
  LEAVE_ROOM = 'LEAVE_ROOM',
  DISCONNECT = 'disconnect'
}

export type GameType =
  | 'PUBLIC_ROOM'
  | 'PRIVATE_ROOM'
  | 'AI_EASY'
  | 'AI_MEDIUM'
  | 'AI_HARD'
  | 'LOCAL';
// type GameStatus = 'WAITING' | 'DURING' | 'FINISHED';

export enum Cell {
  EMPTY = 0,
  WHITE = 1,
  BLACK = 2,
}

export type Board = Cell[];


// SERVER
export interface Game extends Document {
  name: string;
  type: GameType;
  whitePlayer: Player;
  blackPlayer: Player | undefined;
  status: GameStatus;
  turn: string | undefined;
  winner: string | undefined;
  board: Board;
}

type Player = Pick<User, '_id' | 'username'>;
type EndGameStates = 'WIN' | 'LOSS' | 'TIE';

// export type GameStatus = 'WAITING_FOR_OPPONENT' | 'PLAYING' | EndGameStates;

export type MoveData = {
  index: number;
};

export type moveResponse = {
  gameStatus: GameStatus,
  board: Board
};

export interface BaseArgs {
  token: string;
  user: undefined | User;
}

export interface PlayerMoveArgs extends BaseArgs {
  index: number;
}

export enum ServerEvents {
  CreatedRoom = 'CREATED_ROOM',
  GameUpdated = 'GAME_UPDATE'
}

export enum CurrentTurn {
  WHITE = 'WHITE',
  BLACK = 'BLACK'
}

export enum GameStatus {
  NOT_READY = 'NOT_READY',

  WAITING = 'WAITING_FOR_OPPONENT',
  PLAYING = 'PLAYING',

  WIN = 'WIN',
  LOSS = 'LOSS',
  TIE = 'TIE',
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface CreateRoomArgs extends BaseArgs {
  gameType: GameType;
}

export interface JoinRoomArgs extends BaseArgs {
  roomId: string;
}
