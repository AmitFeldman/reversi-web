import {Model, model, Schema} from 'mongoose';
import {
  GameStatus,
  Cell,
  PlayerStatus,
  IGame,
  PlayerColor,
} from 'reversi-types';

const PlayerSchema = new Schema(
  {
    connectionStatus: {
      type: String,
      default: PlayerStatus.DISCONNECTED,
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
  },
  {_id: false}
);

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
    type: Number,
    default: Cell.WHITE,
  },
  winner: {
    type: Number,
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
    type: String,
    required: true,
  },
});

const GameModel = model<IGame, Model<IGame>>('rooms', GameSchema);

export default GameModel;
