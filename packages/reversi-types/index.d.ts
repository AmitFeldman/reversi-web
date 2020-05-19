import {Document} from 'mongoose';

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


type GameType = 'MATCHMAKING' | 'PRIVATE' | 'CPU';
type GameStatus = 'WAITING' | 'DURING' | 'FINISHED';

export enum Cell {
  EMPTY = 0,
  WHITE = 1,
  BLACK = 2
}

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
  name: string,
  type: GameType,
  whitePlayer: Player,
  blackPlayer: Player | undefined,
  status: GameStatus,
  turn: Player._id | undefined,
  winner: Player._id | undefined,
  board: Cell[],
}

type Player = Pick<User, '_id' | 'username'>;
type EndGameStates = 'WIN' | 'LOSS' | 'TIE';

type ClientGameStatus = 'WAITING_FOR_OPPONENT' | 'PLAYING' | EndGameStates;

// // Client
// interface Game extends Documents {
//   name: string;
//   status: ClientGameStatus;
//   enemyName: string;
//   board: Cell[];
// }
