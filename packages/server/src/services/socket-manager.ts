import {emitEventToSocket, Middleware, on, onConnect} from '../utils/socket-service';
import {Socket} from 'socket.io';
import {onGameUpdate, onNewGame} from '../utils/changes-listener';
import {createRoom, disconnectFromGame, joinRoom, playerMove} from '../routes/socket/room';
import {isLoggedIn} from '../middlewares/socket-auth';
import {BaseArgs, ClientEvents, CreateRoomArgs, JoinRoomArgs, PlayerMoveArgs, ServerEvents} from 'reversi-types';

const usersToSockets = new Map<string, Socket>();

// TODO: Add remove listeners on socket disconnect
const initSocketListeners = () => {
  onConnect((socket) => {
    const pushToUsers: Middleware<BaseArgs> = (data, next) => {
      if (data?.user) {
        usersToSockets.set(data.user.id, socket);

        next();
      }
    };

    on(socket, ClientEvents.DISCONNECT, async () => {
      for (const [userId, currentSocket] of usersToSockets) {
        if (currentSocket.id === socket.id) {
          // usersToSockets.delete(userId);

          try {
            await disconnectFromGame(userId);
          } catch (e) {
            console.log(e);
          }
        }
      }
    });

    on(socket, ClientEvents.LEAVE_ROOM, (data) => {
      // ToDo: Update the game to disconnected
    });

    on<CreateRoomArgs>(socket, ClientEvents.CREATE_ROOM, isLoggedIn, pushToUsers, createRoom);

    on<JoinRoomArgs>(socket, ClientEvents.JOINED, isLoggedIn, pushToUsers, joinRoom);

    on<PlayerMoveArgs>(socket, ClientEvents.PLAYER_MOVE, isLoggedIn, pushToUsers, playerMove);
  });
};

const initDbListeners = () => {
  onNewGame((change) => {
    const game = change?.fullDocument;
    const socket = game?.createdBy ? usersToSockets.get(game.createdBy) : undefined;

    if (socket) {
      console.log('Emitted created game');
      emitEventToSocket(socket, ServerEvents.CreatedRoom, game?._id.toString());
    }
  });

  onGameUpdate((change) => {
    const game = change?.fullDocument;
    const whitePlayer = game?.whitePlayer;
    const blackPlayer = game?.blackPlayer;

    if (whitePlayer && !whitePlayer.isCPU && whitePlayer.userId && whitePlayer.connectionStatus === "CONNECTED") {
      const socket = usersToSockets.get(whitePlayer.userId.toString());

      if (socket) {
        console.log("emit game update to white player");
        emitEventToSocket(socket, ServerEvents.GameUpdated, game);
      }
    }

    if (blackPlayer && !blackPlayer.isCPU && blackPlayer.userId && blackPlayer.connectionStatus === "CONNECTED") {
      const socket = usersToSockets.get(blackPlayer.userId.toString());

      if (socket) {
        console.log("emit game update to black player");
        emitEventToSocket(socket, ServerEvents.GameUpdated, game);
      }
    }
  });
};

export {initSocketListeners, initDbListeners};
