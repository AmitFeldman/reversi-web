import {Socket} from 'socket.io';
import {emitEventToSocket, on} from '../../utils/socket-service';
import {ClientEvents, ServerEvents} from '../../types/events';
import GameModel from '../../models/Game';
import {isLoggedIn} from '../../middlewares/auth';


const onCreateRoom = (socket: Socket, callback: () => void) => {
  on(socket, ClientEvents.CreateRoom, async (doc) => {
    const newGame = new GameModel(doc);

    const game = await newGame.save();

    on(socket, ServerEvents.CreatedRoom, () => {
      emitEventToSocket(socket, ServerEvents.CreatedRoom, game._id);
    });
  }, isLoggedIn);
};
