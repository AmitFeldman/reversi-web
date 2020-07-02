import {Document} from 'mongoose';

export interface BaseDocument extends Document {
  date: Date;
}

export enum PlayerStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

export interface User extends BaseDocument {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
}
export enum ClientEvents {
  CREATE_ROOM = 'CREATE_ROOM',
  JOINED = 'JOINED',
  PLAYER_MOVE = 'PLAYER_MOVE',
  LEAVE_ROOM = 'LEAVE_ROOM',
  DISCONNECT = 'DISCONNECT',
}

// ToDo: change to player status
export enum GameStatus {
  NOT_READY = 'NOT_READY',

  WAITING = 'WAITING_FOR_OPPONENT',
  PLAYING = 'PLAYING',

  WIN = 'WIN',
  LOSS = 'LOSS',
  TIE = 'TIE',
}

export type GameType =
  | 'PUBLIC_ROOM'
  | 'PRIVATE_ROOM'
  | 'AI_EASY'
  | 'AI_MEDIUM'
  | 'AI_HARD'
  | 'LOCAL';

export enum Cell {
  EMPTY = 0,
  WHITE = 1,
  BLACK = 2,
}

export type Board = Cell[];

export type PlayerColor = Cell.WHITE | Cell.BLACK;

// SERVER
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface IPlayer extends Document {
  connectionStatus: string;
  isCPU: boolean;
  difficulty: Difficulty | undefined;
  userId: string | undefined;
}

export interface IGame extends BaseDocument {
  name?: string;
  type: GameType;
  whitePlayer: IPlayer | undefined;
  blackPlayer: IPlayer | undefined;
  status: GameStatus;
  turn: PlayerColor | undefined;
  winner: PlayerColor | undefined;
  board: Board;
  createdBy: string;
}

export type MoveData = {
  index: number;
};

export type moveResponse = {
  gameStatus: GameStatus;
  board: Board;
};

export interface BaseArgs {
  token: string;
  user?: undefined | User;
}

export interface CreateRoomArgs extends BaseArgs {
  gameType: GameType;
}

export interface JoinRoomArgs extends BaseArgs {
  roomId: string;
}

export interface PlayerMoveArgs extends BaseArgs {
  roomId: string;
  moveId: number;
}

export enum ServerEvents {
  CreatedRoom = 'CREATED_ROOM',
  GameUpdated = 'GAME_UPDATE',
}
