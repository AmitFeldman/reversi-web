import {Socket} from 'socket.io';
import GameModel from '../models/Game';
import {emitEventToSocket, joinRoom, on} from '../utils/socket-service';
import {ClientEvents, ServerEvents} from '../types/events';
import {onNewGame} from '../utils/changes-listener';

interface IBaseGameRoom {
  id: string;
  playerSocket: Socket;
}

class BaseGameRoom implements IBaseGameRoom {
  id: string = '';
  playerSocket: Socket;

  constructor(socket: Socket) {
    this.playerSocket = socket;
  }

  init(doc: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const newGame = new GameModel(doc);

        const game = await newGame.save();
        this.id = game._id.toString();

        // joinRoom(this.playerSocket, this.id);
        // emitEventToSocket(this.playerSocket, ServerEvents.CreatedRoom, this.id);

        this.addPlayerToRoom();
        this.emitEventToPlayer(ServerEvents.CreatedRoom, this.id);

        on(this.playerSocket, ClientEvents.Ready, resolve);
      } catch (e) {
        reject(e);
      }
    });
  }

  addPlayerToRoom() {
    joinRoom(this.playerSocket, this.id);
  }

  emitEventToPlayer(event: string, ...args: any[]) {
    emitEventToSocket(this.playerSocket, event, ...args);
  }
}

export default BaseGameRoom;
