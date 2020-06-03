import {emitEventToSocket, on, onConnect, onDisconnect} from '../utils/socket-service';
import {Socket} from 'socket.io';
import {onGameUpdate, onNewGame} from '../utils/changes-listener';
import {ClientEvents, ServerEvents} from '../types/events';
import GameModel from '../models/Game';
import {onCreateRoom, onJoinRoom} from '../routes/socket/room';

const usersToSockets = new Map<string, Socket>();

const initSocketListeners = () => {
  onConnect((socket) => {

    on(socket, ClientEvents.DISCONNECT, (data) => {
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

    onCreateRoom(socket, async (data) => {
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

      onJoinRoom(socket, async (data) => {
        // Todo: Update player status in game room to connected
        const game = await GameModel.findById((data.roomId));

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
    const createdBy = game?.createdBy;
    const socket = usersToSockets.get(createdBy);

    if (socket) {
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
    }

    if (blackPlayer && !blackPlayer.isCPU) {
      const socket = usersToSockets.get(blackPlayer._id.toString());

      if (socket) {
        emitEventToSocket(socket, ServerEvents.GameUpdated, game);
      }
    }
  });
};

export {initSocketListeners, initDbListeners};
