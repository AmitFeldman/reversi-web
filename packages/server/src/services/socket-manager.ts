import {Middleware, on, onConnect} from '../utils/socket-service';
import {Socket} from 'socket.io';
import {disconnectFromGame} from '../utils/room';
import {BaseArgs, ClientEvents} from 'reversi-types';

const usersToSockets = new Map<string, Socket>();

const getSocketByUserId = (id: string) => usersToSockets.get(id);

const createPushSocketMiddleware = (socket: Socket): Middleware<BaseArgs> => (
  data,
  next
) => {
  if (data?.user) {
    usersToSockets.set(data.user.id, socket);
    next();
  }
};

const initSocketManager = (onSocketAdd: (socket: Socket) => () => void) => {
  onConnect((socket) => {
    const cleanupListeners = onSocketAdd(socket);

    const cancelOnDisconnect = on(socket, ClientEvents.DISCONNECT, async () => {
      for (const [userId, currentSocket] of usersToSockets) {
        if (currentSocket.id === socket.id) {
          usersToSockets.delete(userId);

          // Event listener cleanup
          cleanupListeners();
          cancelOnDisconnect();

          try {
            await disconnectFromGame(userId);
          } catch (e) {
            console.log(e);
          }
        }
      }
    });

    // TODO: Implement leave room in client + server
    // on(socket, ClientEvents.LEAVE_ROOM, () => {});
  });
};

export {createPushSocketMiddleware, initSocketManager, getSocketByUserId};
