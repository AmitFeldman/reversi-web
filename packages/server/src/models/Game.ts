import {Model, model, Schema} from 'mongoose';
import {GameStatus, Cell, PlayerStatus, IGame} from 'reversi-types';
import {getLegalMoves} from '../utils/game-rules';

export const INITIAL_BOARD = new Array(100).fill(Cell.OUTER);
INITIAL_BOARD.forEach((value, index) =>
  index >= 11 && index <= 88 && index % 10 >= 1 && index % 10 <= 8
    ? (INITIAL_BOARD[index] = Cell.EMPTY)
    : Cell.OUTER
);

INITIAL_BOARD[45] = INITIAL_BOARD[54] = Cell.BLACK;
INITIAL_BOARD[44] = INITIAL_BOARD[55] = Cell.WHITE;

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
    displayName: {
      type: String,
      default: 'Guest',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {_id: false}
);

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
    default: GameStatus.WAITING,
  },
  turn: {
    type: String,
    default: Cell.WHITE,
  },
  winner: {
    type: Number,
  },
  board: {
    type: [String],
    default: INITIAL_BOARD,
  },
  validMoves: {
    type: [{row: Number, column: Number}],
    default: getLegalMoves(Cell.WHITE, INITIAL_BOARD),
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
