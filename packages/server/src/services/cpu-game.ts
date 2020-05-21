import {Socket} from 'socket.io';
import {GameType} from '../types/reversi-types';
import BaseGame from './base-game';

class CpuGame extends BaseGame {
  constructor(socket: Socket, type: GameType) {
    super(socket, type);
  }
}

export default CpuGame;
