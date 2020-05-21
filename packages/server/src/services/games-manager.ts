import BaseGame from './base-game';
import {onConnect} from '../utils/socket-service';
import {CreateRoomArgs, UserEvents} from '../types/events';
import CpuGame from './cpu-game';

interface IGamesManager {
  games: BaseGame[];
}

class GamesManager {
  games: BaseGame[] = [];

  constructor() {
    onConnect((socket) => {
      socket.on(UserEvents.CreateRoom, ({settings}: CreateRoomArgs) => {
        const type = 'AI_EASY';

        this.games.push(new CpuGame(socket, type));
      });
    });
  }
}

export default GamesManager;
