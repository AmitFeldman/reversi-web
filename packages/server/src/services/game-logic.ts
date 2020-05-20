import {Socket} from 'socket.io';
import {Cell, GameStatus, GameType, MoveData} from 'reversi-types';
import MongoGame from '../models/Game';
import {emitEventToRoom} from '../utils/socket-service';

interface IGame {
  id?: string;
  socket: Socket;
  type: GameType;
}

class Game implements IGame{
  id: string;
  socket: Socket;
  type: GameType;

  constructor({socket, type}: IGame) {
    this.id = "";
    this.socket = socket;
    this.type = type;

    // const name = "aaa";
    // const {type} = req.body;

    // const type: GameType = "AI_EASY";

    // const {_id} = req.user;
    // const userId = mongoose.Types.ObjectId(_id);

    const newGame = new MongoGame({
      type
    });

    newGame.save().then((game) => {
      this.id = game._id;

      this.initGame();
    }).catch(err => {
      console.log(err.message)
    });
  }

  initGame() {
    this.socket.join(this.id);

    this.socket.on('playerMove', (moveData: MoveData) => {
      this.playerMove(moveData);
    })
  }

  playerMove(moveData: MoveData) {
    const {index} = moveData;

    MongoGame.findById(this.id).then((game) => {
      if (!game) {
        return;
      }

      game.board[index] = Cell.WHITE;

      emitEventToRoom(this.id, GameStatus.WAITING, game.board);
      this.AIMove();
    });
  }

  AIMove() {
    setTimeout(() => {
      MongoGame.findById(this.id).then((game) => {
        if (!game) {
          return;
        }

        game.board[game.board.indexOf(Cell.EMPTY)] = Cell.BLACK;

        emitEventToRoom(this.id, GameStatus.PLAYING, game.board);
      });
    }, 2000);
  }
}

export default Game;
