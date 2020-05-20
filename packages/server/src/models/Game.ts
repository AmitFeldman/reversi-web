import {Model, model, Schema} from 'mongoose';
import {Game} from 'reversi-types';
// import {Cell, Game, GameStatus, GameType, Player} from 'reversi-types';

const GameSchema = new Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
    required: true
  },
  whitePlayer: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  blackPlayer: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  status: {
    type: String,
  },
  turn: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  board: {
    type: [Number],
  }
});

const Game = model<Game, Model<Game>>('rooms', GameSchema);


// // SERVER
// interface Game extends Document {
//   name: string,
//   type: GameType,
//   whitePlayer: Player,
//   blackPlayer: Player | undefined,
//   status: GameStatus,
//   turn: Player._id | undefined,
//   winner: Player._id | undefined,
//   board: Cell[],
// }

export default Game;
