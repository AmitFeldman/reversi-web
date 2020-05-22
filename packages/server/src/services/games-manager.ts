import {onConnect} from '../utils/socket-service';
import {ClientEvents, BaseArgs} from '../types/events';
import {GameType, IGame} from '../models/Game';
import BaseGameRoom from './base-game-room';
import {Document} from 'mongoose';

const games: any[] = [];

interface GameSettings {
  type: GameType;
}

interface CreateGameArgs extends BaseArgs {
  settings: GameSettings;
}

const initGamesManager = () => {
  onConnect((socket) => {
    socket.on(ClientEvents.CreateRoom, async ({settings}: CreateGameArgs) => {
      const {type} = settings;

      const gameRoom = new BaseGameRoom(socket);
      games.push(gameRoom);

      await gameRoom.init();

      gameRoom.start();
    });
  });
};

// Mongoose constructors types hard coded receive any document
const gameBuilder = (type: GameType): any => {
  return {
    type: type,
    whitePlayer: {
      isCPU: false,
    },
    blackPlayer: {
      isCPU: true,
      difficulty: 'EASY',
    },
  };
};

export {initGamesManager};
