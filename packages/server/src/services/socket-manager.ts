import {emitEventToSocket, Middleware, on, onConnect} from '../utils/socket-service';
import {Socket} from 'socket.io';
import {onGameUpdate, onNewGame} from '../utils/changes-listener';
import {createRoom, disconnectFromGame, joinRoom, playerMove} from '../routes/socket/room';
import BsonObjectId from 'bson-objectid';
import {isLoggedIn} from '../middlewares/socket-auth';
import {BaseArgs, ClientEvents, CreateRoomArgs, JoinRoomArgs, PlayerMoveArgs, ServerEvents} from 'reversi-types';

const usersToSockets = new Map<string, Socket>();

const bsonToObjectId = (bsonItem: Buffer) => new BsonObjectId(bsonItem).str;

const initSocketListeners = () => {
  onConnect((socket) => {
    const pushToUsers: Middleware<BaseArgs> = (data, next) => {
      if (data?.user) {
        usersToSockets.set(data.user.id, socket);

        next();
      }
    };

    on(socket, ClientEvents.DISCONNECT, () => {
      console.log('socket disconnected!!!!');

      usersToSockets.forEach(async (currentSocket: Socket, userId: string) => {
        if (currentSocket.id === socket.id) {
          usersToSockets.delete(userId);

          console.log("Before!!!!!!!!!!!");
          await disconnectFromGame(userId);
          console.log("AFTERRRRRRRRRRRRRRRRRRRRRRRRR");
        }
      });
    });

    on(socket, ClientEvents.LEAVE_ROOM, (data) => {
      console.log('socket disconnected!!!!');
      // ToDo: update the game to disconnected
    });

    on<CreateRoomArgs>(socket, ClientEvents.CreateRoom, isLoggedIn, pushToUsers, createRoom);

    on<JoinRoomArgs>(socket, ClientEvents.JOINED, isLoggedIn, pushToUsers, joinRoom);

    on<PlayerMoveArgs>(socket, ClientEvents.PlayerMove, isLoggedIn, pushToUsers, playerMove);
  });
};

const initDbListeners = () => {
  onNewGame((change) => {
    const game = change?.fullDocument;
    const createdBy = bsonToObjectId(game?.createdBy?.id);
    const socket = usersToSockets.get(createdBy);

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
