import GameModel from '../models/Game';
import {
  Cell,
  CreateRoomArgs,
  IGame,
  JoinRoomArgs,
  PlayerMoveArgs,
  PlayerStatus,
  ServerEvents,
} from 'reversi-types';
import mongoose from 'mongoose';
import {emitEventToSocket} from './socket-service';
import {getSocketByUserId} from '../services/socket-manager';
import {ChangeEventCR, ChangeEventUpdate} from 'mongodb';
import {makeMove} from './game-rules';

const createRoom = async (data: CreateRoomArgs) => {
  try {
    const newGame = new GameModel({
      createdBy: data?.user?.id,
      whitePlayer: {
        userId: data?.user?.id,
        isCPU: false,
      },
      blackPlayer: {
        connectionStatus: data.gameType.includes('AI')
          ? PlayerStatus.CONNECTED
          : PlayerStatus.DISCONNECTED,
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
    game?.whitePlayer?.connectionStatus === PlayerStatus.DISCONNECTED
  ) {
    game.whitePlayer.connectionStatus = PlayerStatus.CONNECTED;
    await game.save();
  } else if (
    !game?.blackPlayer?.isCPU &&
    game?.blackPlayer?.connectionStatus === PlayerStatus.DISCONNECTED
  ) {
    game.blackPlayer.connectionStatus = PlayerStatus.CONNECTED;
    game.blackPlayer.userId = data?.user?._id;
    await game.save();
  }
};

const playerMove = async ({
  roomId,
  move: {row, column},
  user,
}: PlayerMoveArgs) => {
  const game = await GameModel.findById(roomId);
  const whitePlayerId = game?.whitePlayer?.userId?.toString();
  const blackPlayerId = game?.blackPlayer?.userId?.toString();
  const index = Number(`${row}${column}`);

  if (
    !game?.whitePlayer?.isCPU &&
    (user?.id === whitePlayerId || user?._id === whitePlayerId) &&
    game &&
    game.turn === Cell.WHITE
  ) {
    // newBoard[data.moveId] = Cell.WHITE;
    game.board = makeMove(index, Cell.WHITE, game.board);
    game.turn = Cell.BLACK;
  } else if (
    (user?.id === blackPlayerId || user?._id === blackPlayerId) &&
    game &&
    game.turn === Cell.BLACK
  ) {
    game.board = makeMove(index, Cell.BLACK, game.board);
    game.turn = Cell.WHITE;
  }

  await game?.save();

  // if (game?.type.includes('AI')) {
  //   await aiMove(data);
  // }
};

const aiMove = async ({roomId, move: {row, column}}: PlayerMoveArgs) => {
  const game = await GameModel.findById(roomId);
  const newBoard = game ? [...game.board] : [];
  const index = Number(`${row}${column}`);

  setTimeout(async () => {
    if (game) {
      newBoard[index] = Cell.BLACK;
      game.board = newBoard;
      game.turn = Cell.WHITE;
    }

    await game?.save();
  }, 1500);
};

const disconnectFromGame = async (id: string) => {
  const userId = mongoose.Types.ObjectId(id);
  const whitePlayerGames = await GameModel.find({
    $and: [
      {'whitePlayer.userId': userId},
      {'whitePlayer.connectionStatus': PlayerStatus.CONNECTED},
    ],
  });
  const blackPlayerGames = await GameModel.find({
    $and: [
      {'blackPlayer.userId': userId},
      {'blackPlayer.connectionStatus': PlayerStatus.CONNECTED},
    ],
  });

  whitePlayerGames.forEach((game) => {
    if (game?.whitePlayer?.connectionStatus === PlayerStatus.CONNECTED) {
      game.whitePlayer.connectionStatus = PlayerStatus.DISCONNECTED;

      game.save();
    }
  });

  blackPlayerGames.forEach((game) => {
    if (game?.blackPlayer?.connectionStatus === PlayerStatus.CONNECTED) {
      game.blackPlayer.connectionStatus = PlayerStatus.DISCONNECTED;

      game.save();
    }
  });
};

const onNewGame = (change: ChangeEventCR<IGame>) => {
  const game = change?.fullDocument;
  const socket = game?.createdBy
    ? getSocketByUserId(game.createdBy)
    : undefined;

  if (socket) {
    console.log('Emitted created game');
    emitEventToSocket(socket, ServerEvents.CreatedRoom, game?._id.toString());
  }
};

const onGameUpdate = (change: ChangeEventUpdate<IGame>) => {
  const game = change?.fullDocument;
  const whitePlayer = game?.whitePlayer;
  const blackPlayer = game?.blackPlayer;

  if (
    whitePlayer &&
    !whitePlayer.isCPU &&
    whitePlayer.userId &&
    whitePlayer.connectionStatus === 'CONNECTED'
  ) {
    const socket = getSocketByUserId(whitePlayer.userId.toString());

    if (socket) {
      console.log('emit game update to white player');
      emitEventToSocket(socket, ServerEvents.GameUpdated, game);
    }
  }

  if (
    blackPlayer &&
    !blackPlayer.isCPU &&
    blackPlayer.userId &&
    blackPlayer.connectionStatus === 'CONNECTED'
  ) {
    const socket = getSocketByUserId(blackPlayer.userId.toString());

    if (socket) {
      console.log('emit game update to black player');
      emitEventToSocket(socket, ServerEvents.GameUpdated, game);
    }
  }
};

export {
  createRoom,
  joinRoom,
  playerMove,
  disconnectFromGame,
  onNewGame,
  onGameUpdate,
};
