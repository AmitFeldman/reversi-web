import {onConnect, onDisconnect, on} from '../utils/socket-service';
import {Socket} from 'socket.io';
import {disconnectFromGame} from '../utils/room';
import {BaseArgs, ClientEvents} from 'reversi-types';
import {isLoggedIn} from '../middlewares/socket-auth';

// Map of all authenticated (logged in) user ids to their sockets
const usersToSockets = new Map<string, Socket>();

const getSocketByUserId = (id: string) => usersToSockets.get(id);

const removeBySocket = ({id: socketId}: Socket): string | undefined => {
  for (const [userId, {id: currId}] of usersToSockets) {
    if (currId === socketId) {
      usersToSockets.delete(userId);

      return userId;
    }
  }
};

// When a player disconnects for any reason
const onUserDisconnect = (userId: string) => {
  disconnectFromGame(userId).catch((e) =>
    console.log(`Socket Manager - Error disconnecting user`, e)
  );
};

const initSocketManager = (onSocketAuthentication: (socket: Socket) => () => void) => {
  onConnect((socket) => {
    // Make sure that auth connect is sent with valid user by passing isLoggedIn middleware
    const cancelOnAuthConnect = on<BaseArgs>(
      socket,
      ClientEvents.AUTH_CONNECT,
      isLoggedIn,
      (data) => {
        console.log(`Socket Manager - Socket ${socket.id} Authenticated`);
        usersToSockets.set(data.user?.id, socket);

        const cleanupSocketAddListeners = onSocketAuthentication(socket);

        // Client disconnect (logout)
        const cancelOnAuthDisconnect = on<BaseArgs>(
          socket,
          ClientEvents.AUTH_DISCONNECT,
          isLoggedIn,
          (data) => {
            console.log(`Socket Manager - Socket ${socket.id} Unauthenticated`);

            cleanupListeners();
            onUserDisconnect(data.user?.id);
          }
        );

        // On this disconnect we don't have the id of the user disconnecting (refresh, closed window, etc...)
        const cancelOnDisconnect = onDisconnect(socket, async (reason) => {
          cleanupListeners();

          const removedId = removeBySocket(socket);
          if (removedId) {
            console.log(
              `Socket Manager - Socket ${socket.id} Unauthenticated by disconnect`
            );
            onUserDisconnect(removedId);
          }
        });

        const cleanupListeners = () => {
          cleanupSocketAddListeners();
          cancelOnDisconnect();
          cancelOnAuthDisconnect();
        };
      }
    );
  });
};

export {initSocketManager, getSocketByUserId};
