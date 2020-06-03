import {emitEventToSocket, Middleware, on, onConnect, onDisconnect} from '../utils/socket-service';
import {Socket} from 'socket.io';
import {onGameUpdate, onNewGame} from '../utils/changes-listener';
import {BaseArgs, ClientEvents, ServerEvents} from '../types/events';
import GameModel from '../models/Game';
import {onCreateRoom, onJoinRoom} from '../routes/socket/room';
import BsonObjectId from 'bson-objectid';

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

    on(socket, ClientEvents.DISCONNECT,(data) => {
      console.log("socket disconnected!!!!");
    });

    onDisconnect(socket, () => {
      // usersToSockets.delete(userId);
      console.log("zain tov");

      // ToDo: Update player status in game room to disconnected (leave room)
    });

    socket.on(ClientEvents.CreateRoom, (data) => {
      console.log(data.toString());
      console.log("asldjasljdhaslkjdhaskdjhaskdjh");
    });

    onCreateRoom(socket, pushToUsers, async (data) => {
      console.log(`AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ${data}`);

      try {
        const newGame = new GameModel({
          createdBy: data.token,
          whitePlayer: {
            isCPU: false
          },
          blackPlayer: {
            isCPU: data.gameType.includes("CPU")
          },
          type: data.gameType
        });

        await newGame.save();
      } catch (e) {
        console.log(e);
      }
    });

    onJoinRoom(socket, pushToUsers, async (data) => {
      // Todo: Update player status in game room to connected
      const game = await GameModel.findById(data.roomId);

      if (!game?.whitePlayer?.isCPU && game?.whitePlayer?.connectionStatus === "DISCONNECTED") {
        game.whitePlayer.connectionStatus = "CONNECTED";
        await game.save();
      }
    });
    //
    //   onLeaveRoom((roomId: string, userId: string) => {
    //     // ToDo: Update player status in game room to disconnected
    //   });
    // });
    //
    // onLoggedOut((userId) => {
    //   usersToSockets.delete(userId);
    //
    //   // ToDo: Update player status in game room to disconnected
    // });
  });
};

const NEW_GAME_EVENT = 'NEW_GAME_EVENT';
const GAME_UPDATE_EVENT = 'GAME_UPDATE_EVENT';

const initDbListeners = () => {
  onNewGame((change) => {
    const game = change?.fullDocument;
    const createdBy = bsonToObjectId(game?.createdBy?.id);
    const socket = usersToSockets.get(createdBy);

    if (socket) {
      console.log("Emitted created gane");
      emitEventToSocket(socket, ServerEvents.CreatedRoom, game?._id.toString());
    }
  });

  onGameUpdate((change) => {
    const game = change?.fullDocument;
    const whitePlayer = game?.whitePlayer;
    const blackPlayer = game?.blackPlayer;

    if (whitePlayer && !whitePlayer.isCPU) {
      const socket = usersToSockets.get(whitePlayer._id.toString());

      if (socket) {
        emitEventToSocket(socket, ServerEvents.GameUpdated, game);
      }
    } else if (blackPlayer && !blackPlayer.isCPU) {
      const socket = usersToSockets.get(blackPlayer._id.toString());

      if (socket) {
        emitEventToSocket(socket, ServerEvents.GameUpdated, game);
      }
    }
  });
};

export {initSocketListeners, initDbListeners};
