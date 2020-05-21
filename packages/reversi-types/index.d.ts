import {Document} from 'mongoose';

// Duplicate of reversi-types package TODO: Fix alias paths

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  date: string;
}

// export const EVENT_GAME_CREATED = 'game-created';
// export const EVENT_GAME_JOINED = 'game-joined';
// export const EVENT_STATE_CHANGED = 'game-state-changed';
// export const EVENT_GAME_FINISHED = 'game-finished';

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

// interface Game extends Document {
//   name: string,
//   type: GameType,
//   whitePlayer: Player,
//   blackPlayer: Player | undefined,
//   status: string,
//   turn: 'WHITE' | 'BLACK',
//   board: Cell[],
// }
//
// type Player = Pick<User, '_id' | 'username'>;

// interface Game extends Document {
//   name: string,
//   type: GameType,
//   whitePlayer: Player,
//   blackPlayer: Player | undefined,
//   status: string,
//   turn: 'WHITE' | 'BLACK',
//   board: Cell[],
// }

// SERVER
export interface Game extends Document {
  name: string;
  type: GameType;
  whitePlayer: Player;
  blackPlayer: Player | undefined;
  status: GameStatus;
  turn: Player['_id'] | undefined;
  winner: Player['_id'] | undefined;
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

export enum GameStatus {
  WAITING = 'WAITING_FOR_OPPONENT',
  PLAYING = 'PLAYING',
  WIN = 'WIN',
  LOSS = 'LOSS',
  TIE = 'TIE',
}

// // Client
// interface Game extends Documents {
//   name: string;
//   status: ClientGameStatus;
//   enemyName: string;
//   board: Cell[];
// }
