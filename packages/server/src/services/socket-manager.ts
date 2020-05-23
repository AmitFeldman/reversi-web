import {emitEventToSocket, on, onConnect, onDisconnect} from '../utils/socket-service';
import {Socket} from 'socket.io';
import {onGameUpdate, onNewGame} from '../utils/changes-listener';
import {ClientEvents, ServerEvents} from '../types/events';
import GameModel from '../models/Game';

const usersToSockets = new Map<string, Socket>();

const getUsersToSockets = () => {
  return usersToSockets;
};

const initSocketListeners = () => {
  onConnect((socket) => {
    onLoggedIn((userId) => {
      usersToSockets.set(userId, socket);

      onDisconnect(socket, () => {
        usersToSockets.delete(userId);

        // ToDo: Update player status in game room to disconnected (leave room)
      });


      onJoinRoom((roomId: string, userId: string) => {
        // Todo: Update player status in game room to connected
      });

      onLeaveRoom((roomId: string, userId: string) => {
        // ToDo: Update player status in game room to disconnected
      });
    });
  });

  onLoggedOut((userId) => {
    usersToSockets.delete(userId);

    // ToDo: Update player status in game room to disconnected
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
      emitEventToSocket(socket, NEW_GAME_EVENT, game?._id.toString());
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
