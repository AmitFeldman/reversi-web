import {Socket} from 'socket.io';
import {Middleware, on} from '../../utils/socket-service';
import {BaseArgs, ClientEvents} from '../../types/events';
import GameModel, {GameType} from '../../models/Game';
import {isLoggedIn} from '../../middlewares/socket-auth';

export interface CreateRoomArgs extends BaseArgs {
  gameType: GameType;
}

export interface JoinRoomArgs extends BaseArgs {
  roomId: string;
}

const createRoom = async (data: CreateRoomArgs) => {
  try {
    const newGame = new GameModel({
      createdBy: data.token,
      whitePlayer: {
        userId: data.token,
        isCPU: false,
      },
      blackPlayer: {
        connectionStatus: data.gameType.includes('AI') ? "CONNECTED" : "DISCONNECTED",
        isCPU: data.gameType.includes('AI'),
      },
      type: data.gameType,
    });

    await newGame.save();
  } catch (e) {
    console.log(e);
  }
};

const joinRoom = async (data: JoinRoomArgs) => {
  const game = await GameModel.findById(data.roomId);

  if (
    !game?.whitePlayer?.isCPU &&
    game?.whitePlayer?.connectionStatus === 'DISCONNECTED'
  ) {
    game.whitePlayer.connectionStatus = 'CONNECTED';
    await game.save();
  } else if (
    !game?.blackPlayer?.isCPU &&
    game?.blackPlayer?.connectionStatus === 'DISCONNECTED'
  ) {
    game.blackPlayer.connectionStatus = 'CONNECTED';
  }
};

export {createRoom, joinRoom};
