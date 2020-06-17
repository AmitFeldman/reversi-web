import GameModel from '../../models/Game';
import {BaseArgs, Cell, CreateRoomArgs, CurrentTurn, JoinRoomArgs, PlayerMoveArgs, PlayerStatus} from 'reversi-types';
import mongoose from 'mongoose';

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

const playerMove = async (data: PlayerMoveArgs) => {
  const game = await GameModel.findById(data.roomId);
  const whitePlayerId = game?.whitePlayer?.userId?.toString();
  const blackPlayerId = game?.blackPlayer?.userId?.toString();

  const newBoard = game ? [...game.board] : [];

  if (
    !game?.whitePlayer?.isCPU &&
    (data?.user?.id === whitePlayerId || data?.user?._id === whitePlayerId) &&
    game && game.turn === CurrentTurn.WHITE
  ) {
    newBoard[data.moveId] = Cell.WHITE;
    game.board = newBoard;
    game.turn = CurrentTurn.BLACK;
  } else if (
    (data?.user?.id === blackPlayerId || data?.user?._id === blackPlayerId) &&
    game && game.turn === CurrentTurn.BLACK
  ) {
    newBoard[data.moveId] = Cell.BLACK;
    game.board = newBoard;
    game.turn = CurrentTurn.WHITE;
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
      game.turn = CurrentTurn.WHITE;
    }

    await game?.save();
  }, 1500);
};

const disconnectFromGame = async (id: string) => {
  console.log("YESHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
  const userId = mongoose.Types.ObjectId(id);
  const whitePlayerGames = await GameModel.find({ $and: [{"whitePlayer.userId": userId}, {"whitePlayer.connectionStatus": PlayerStatus.CONNECTED}] });
  const blackPlayerGames = await GameModel.find({ $and: [{"blackPlayer.userId": userId}, {"blackPlayer.connectionStatus": PlayerStatus.CONNECTED}] });

  whitePlayerGames.forEach(async (game) => {
    if (game?.whitePlayer?.connectionStatus === PlayerStatus.CONNECTED) {
      game.whitePlayer.connectionStatus = PlayerStatus.DISCONNECTED;

      await game.save();
    }
  });

  blackPlayerGames.forEach(async (game) => {
    if (game?.blackPlayer?.connectionStatus === PlayerStatus.CONNECTED) {
      game.blackPlayer.connectionStatus = PlayerStatus.DISCONNECTED;

      await game.save();
    }
  })
};

export {createRoom, joinRoom, playerMove, disconnectFromGame};
