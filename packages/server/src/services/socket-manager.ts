import {emitEventToSocket, Middleware, on, onConnect} from '../utils/socket-service';
import {Socket} from 'socket.io';
import {onGameUpdate, onNewGame} from '../utils/changes-listener';
import {BaseArgs, ClientEvents, ServerEvents} from '../types/events';
import {createRoom, CreateRoomArgs, joinRoom, JoinRoomArgs, playerMove, PlayerMoveArgs} from '../routes/socket/room';
import BsonObjectId from 'bson-objectid';
import {isLoggedIn} from '../middlewares/socket-auth';

const usersToSockets = new Map<string, Socket>();

const bsonToObjectId = (bsonItem: Buffer) => new BsonObjectId(bsonItem).str;

const initSocketListeners = () => {
  onConnect((socket) => {
    const pushToUsers: Middleware<BaseArgs> = (data, next) => {
      if (data?.user) {
        usersToSockets.set(data.user.id, socket);
      }

      next();
    };

    on(socket, ClientEvents.DISCONNECT, (data) => {
      console.log('socket disconnected!!!!');

      usersToSockets.forEach((currentSocket: Socket, userId: string) => {
        if (currentSocket.id === socket.id) {
          usersToSockets.delete(userId);
        }
      });
    });

    on(socket, ClientEvents.LEAVE_ROOM, (data) => {
      console.log('socket disconnected!!!!');
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

    if (whitePlayer && !whitePlayer.isCPU && whitePlayer.userId) {
      const socket = usersToSockets.get(whitePlayer.userId.toString());

      if (socket) {
        console.log("emit game update to white player");
        emitEventToSocket(socket, ServerEvents.GameUpdated, game);
      }
    } else if (blackPlayer && !blackPlayer.isCPU && blackPlayer.userId) {
      const socket = usersToSockets.get(blackPlayer.userId.toString());

      if (socket) {
        console.log("emit game update to black player");
        emitEventToSocket(socket, ServerEvents.GameUpdated, game);
      }
    }
  });
};

export {initSocketListeners, initDbListeners};
