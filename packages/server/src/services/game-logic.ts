import {Socket} from 'socket.io';
import MongoGame from '../models/Game';
import {emitEventToRoom} from '../utils/socket-service';
// import {Cell, GameStatus, GameType, MoveData} from 'reversi-types';

type GameType =
  | 'PUBLIC_ROOM'
  | 'PRIVATE_ROOM'
  | 'AI_EASY'
  | 'AI_MEDIUM'
  | 'AI_HARD'
  | 'LOCAL';

enum Cell {
  EMPTY = 0,
  WHITE = 1,
  BLACK = 2,
}

type MoveData = {
  index: number;
};

enum GameStatus {
  WAITING = 'WAITING_FOR_OPPONENT',
  PLAYING = 'PLAYING',
  WIN = 'WIN',
  LOSS = 'LOSS',
  TIE = 'TIE',
}

interface IGame {
  id?: string;
  socket: Socket;
  type: GameType;
}

class Game implements IGame {
  id: string;
  socket: Socket;
  type: GameType;

  constructor({socket, type}: IGame) {
    this.id = '';
    this.socket = socket;
    this.type = type;

    // const name = "aaa";
    // const {type} = req.body;

    // const type: GameType = "AI_EASY";

    // const {_id} = req.user;
    // const userId = mongoose.Types.ObjectId(_id);

    const newGame = new MongoGame({
      type,
      board: new Array(64).fill(0),
    });

    newGame
      .save()
      .then((game) => {
        this.id = game._id;

        this.initGame();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initGame() {
    this.socket.join(this.id);
    this.socket.emit('createRoom', this.id);

    this.socket.on('playerMove', (moveData: string) => {
      this.playerMove(JSON.parse(moveData) as MoveData);
    });
  }

  playerMove(moveData: MoveData) {
    const {index} = moveData;

    MongoGame.findById(this.id).then((game) => {
      if (!game) {
        return;
      }

      game.board[index] = Cell.WHITE;
      game.save().then(() => {
        emitEventToRoom(this.id, GameStatus.WAITING, game.board);
        this.AIMove();
      });
    });
  }

  AIMove() {
    setTimeout(() => {
      MongoGame.findById(this.id).then((game) => {
        if (!game) {
          return;
        }

        game.board[game.board.indexOf(Cell.EMPTY)] = Cell.BLACK;
        game.save().then(() => {
          emitEventToRoom(this.id, GameStatus.PLAYING, game.board);
        });
      });
    }, 2000);
  }
}

export default Game;
