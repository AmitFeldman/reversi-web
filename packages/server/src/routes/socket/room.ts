import {Socket} from 'socket.io';
import {Middleware, on} from '../../utils/socket-service';
import {BaseArgs, ClientEvents} from '../../types/events';
import GameModel, {Cell, GameType} from '../../models/Game';
import {isLoggedIn} from '../../middlewares/socket-auth';
import {white} from 'color-name';
import BsonObjectId from 'bson-objectid';

const bsonToObjectId = (bsonItem: Buffer) => new BsonObjectId(bsonItem).str;

export interface CreateRoomArgs extends BaseArgs {
  gameType: GameType;
}

export interface JoinRoomArgs extends BaseArgs {
  roomId: string;
}

export interface PlayerMoveArgs extends BaseArgs {
  roomId: string;
  moveId: number;
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
        connectionStatus: data.gameType.includes('AI')
          ? 'CONNECTED'
          : 'DISCONNECTED',
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

const playerMove = async (data: PlayerMoveArgs) => {
  const game = await GameModel.findById(data.roomId);
  const whitePlayerId = game?.whitePlayer?.userId?.toString();
  const blackPlayerId = game?.blackPlayer?.userId?.toString();

  const newBoard = game ? [...game.board] : [];

  if (
    !game?.whitePlayer?.isCPU &&
    (data?.user?.id === whitePlayerId || data.token === whitePlayerId) &&
    game
  ) {
    newBoard[data.moveId] = Cell.WHITE;
    game.board = newBoard;
  } else if (
    (data?.user?.id === blackPlayerId || data.token === blackPlayerId) &&
    game
  ) {
    newBoard[data.moveId] = Cell.BLACK;
    game.board = newBoard;
  }

  await game?.save();

  if (game?.type.includes('AI')) {
    await aiMove(data);
  }
};

const aiMove = async (data: PlayerMoveArgs) => {
  const game = await GameModel.findById(data.roomId);
  const newBoard = game ? [...game.board] : [];

  setTimeout(async () => {
    if (game) {
      newBoard[data.moveId - 8] = Cell.BLACK;
      game.board = newBoard;
    }

    await game?.save();
  }, 1500);
};

export {createRoom, joinRoom, playerMove};
