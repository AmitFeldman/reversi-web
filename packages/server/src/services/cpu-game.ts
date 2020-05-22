import {Socket} from 'socket.io';
import GameModel, {Cell, GameStatus, GameType} from '../models/Game';
import BaseGame from './base-game';
import {} from '../utils/socket-service';
import {MoveData} from '../types/events';

class CpuGame extends BaseGame {
  constructor(socket: Socket, type: GameType) {
    super(socket, type);
  }

  playerMove(moveData: MoveData) {
    super.playerMove(moveData);

    this.AIMove();
  }

  AIMove() {
    setTimeout(() => {
      GameModel.findById(this.id).then((game) => {
        if (!game) {
          return;
        }

        game.board[game.board.indexOf(Cell.EMPTY)] = Cell.BLACK;

        const response = {gameStatus: GameStatus.WAITING, board: game.board};

        game.save().then(() => {
          console.log(this.id);
          // emitEventInRoom(this.id, this.id, JSON.stringify(response));
        });
      });
    }, 2000);
  }
}

export default CpuGame;
