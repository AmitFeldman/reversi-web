import {Socket} from 'socket.io';
import GameModel from '../models/Game';
import {emitEventIn} from '../utils/socket-service';
import {Cell, GameStatus, GameType, MoveData} from '../types/reversi-types';
import {ServerEvents} from '../types/events';

const INITIAL_BOARD = new Array(64).fill(0);
INITIAL_BOARD[36] = INITIAL_BOARD[45] = Cell.BLACK;
INITIAL_BOARD[37] = INITIAL_BOARD[44] = Cell.WHITE;

interface IBaseGame {
  id?: string;
  socket: Socket;
  type: GameType;
}

class BaseGame implements IBaseGame {
  id: string = '';
  socket: Socket;
  type: GameType;

  constructor(socket: Socket, type: GameType) {
    this.socket = socket;
    this.type = type;

    // Save new game to DB
    // TODO: Check if game already exists for pvp games
    const newGame = new GameModel({
      type,
      board: INITIAL_BOARD,
    });

    newGame
      .save()
      .then((game) => {
        this.id = game._id.toString();

        this.initGame();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initGame() {
    // Add user to game room by id
    this.socket.join(this.id);
    this.socket.emit(ServerEvents.CreatedRoom, this.id);

    this.socket.on('playerMove', (moveData: string) => {
      console.log('PLAYER MOVEEEEEEE');
      console.log(moveData);
      this.playerMove(JSON.parse(moveData) as MoveData);
    });
  }

  playerMove(moveData: MoveData) {
    const {index} = moveData;

    GameModel.findById(this.id).then((game) => {
      if (!game) {
        return;
      }

      game.board[index] = Cell.WHITE;
      game.save().then(() => {
        console.log('player move');
        console.log(this.id);
        emitEventIn(
          this.id,
          this.id,
          JSON.stringify({a: GameStatus.WAITING, b: game.board})
        );
        this.AIMove();
      });
    });
  }

  AIMove() {
    setTimeout(() => {
      GameModel.findById(this.id).then((game) => {
        if (!game) {
          return;
        }

        game.board[game.board.indexOf(Cell.EMPTY)] = Cell.BLACK;
        game.save().then(() => {
          console.log(this.id);
          emitEventIn(
            this.id,
            this.id,
            JSON.stringify({a: GameStatus.WAITING, b: game.board})
          );
        });
      });
    }, 2000);
  }
}

export default BaseGame;
