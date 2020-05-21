import {Socket} from 'socket.io';
import GameModel from '../models/Game';
import {emitEventInRoom} from '../utils/socket-service';
import {Cell, GameType, MoveData, GameStatus, moveResponse} from '../types/reversi-types';
import {ServerEvents} from '../types/events';

const INITIAL_BOARD = new Array(64).fill(0);
INITIAL_BOARD[36] = INITIAL_BOARD[45] = Cell.BLACK;
INITIAL_BOARD[37] = INITIAL_BOARD[44] = Cell.WHITE;

interface IBaseGame {
  id: string;
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
  }

  async init() {
    // Save new game to DB
    // TODO: Check if game already exists for pvp games
    const newGame = new GameModel({
      type: this.type,
      board: INITIAL_BOARD,
    });

    newGame
      .save()
      .then((game) => {
        this.id = game._id.toString();
        // this.init();

        this.socket.join(this.id);
        this.socket.emit(ServerEvents.CreatedRoom, this.id);

        this.socket.on("READY", () => {

        });
      })
      .catch((err) => {
        console.log(err.message);
      });


    // // Add user to game room by i
  }

  start() {
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

      // new moveResponse(GameStatus.WAITING, game.board);

      game.board[index] = Cell.WHITE;
      const response: moveResponse = {gameStatus: GameStatus.WAITING, board: game.board};

      game.save().then(() => {
        console.log('player move');
        console.log(this.id);
        emitEventInRoom(
          this.id,
          this.id,
          JSON.stringify(response)
        );
      });
    });
  }
}

export default BaseGame;
