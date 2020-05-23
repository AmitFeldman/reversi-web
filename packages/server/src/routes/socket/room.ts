import {Socket} from 'socket.io';
import {emitEventToSocket, on} from '../../utils/socket-service';
import {ClientEvents, ServerEvents} from '../../types/events';
import GameModel from '../../models/Game';

const isLoggedIn = () => {
  return true;
};

const onCreateRoom = (socket: Socket, callback: () => void) => {
  on(socket, ClientEvents.CreateRoom, async (doc) => {
    const newGame = new GameModel(doc);

    const game = await newGame.save();

    on(socket, ServerEvents.CreatedRoom, (gameId: string) => {
      emitEventToSocket(socket, ServerEvents.CreatedRoom, gameId)
    });
  }, isLoggedIn);
};
