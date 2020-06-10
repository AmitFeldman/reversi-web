import {Document, Model, model, Schema} from 'mongoose';
import {BaseDocument} from '../types/base-document';
import {User} from 'reversi-types';

export enum Cell {
  EMPTY = 0,
  WHITE = 1,
  BLACK = 2,
}

export enum GameStatus {
  NOT_READY = 'NOT_READY',

  WAITING = 'WAITING_FOR_OPPONENT',
  PLAYING = 'PLAYING',

  WIN = 'WIN',
  LOSS = 'LOSS',
  TIE = 'TIE',
}

export enum CurrentTurn {
  WHITE = 'WHITE',
  BLACK = 'BLACK'
}

export type GameType =
  | 'PUBLIC'
  | 'PRIVATE'
  | 'CPU-EASY'
  | 'CPU-MEDIUM'
  | 'CPU-HARD'
  | 'LOCAL';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type Board = Cell[];

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
  turn: IPlayer['_id'] | undefined;
  winner: IPlayer['_id'] | undefined;
  board: Board;
  createdBy: User["_id"];
}

const PlayerSchema = new Schema({
  connectionStatus: {
    type: String,
    default: 'DISCONNECTED',
  },
  difficulty: {
    type: String,
  },
  isCPU: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

const INITIAL_BOARD = new Array(64).fill(0);
INITIAL_BOARD[27] = INITIAL_BOARD[36] = Cell.BLACK;
INITIAL_BOARD[28] = INITIAL_BOARD[35] = Cell.WHITE;

export const GameSchema = new Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  whitePlayer: PlayerSchema,
  blackPlayer: PlayerSchema,
  status: {
    type: String,
    default: GameStatus.NOT_READY,
  },
  turn: {
    type: CurrentTurn,
    default: CurrentTurn.WHITE
  },
  winner: {
    type: Schema.Types.ObjectId,
  },
  board: {
    type: [Number],
    default: INITIAL_BOARD,
  },
  date: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const GameModel = model<IGame, Model<IGame>>('rooms', GameSchema);

export default GameModel;
