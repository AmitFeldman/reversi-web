import GameModel from '../models/Game';
import {
  Board,
  Cell,
  CreateRoomArgs,
  GameType,
  IGame,
  IPlayer,
  JoinRoomArgs,
  PlayerColor,
  PlayerMoveArgs,
  PlayerStatus,
  ServerEvents,
} from 'reversi-types';
import mongoose from 'mongoose';
import {emitEventToSocket} from './socket-service';
import {getSocketByUserId} from '../services/socket-manager';
import {ChangeEventCR, ChangeEventUpdate} from 'mongodb';
import {getLegalMoves, isLegal, isValid, makeMove} from './game-rules';
import {ai_play, AiBody, gameTypesToStrategy} from './ai/ai-api';

const AI_TIMEOUT = 1000;

const cpuDisplayNames: Map<GameType, string> = new Map([
  ['AI_EASY', 'Easy Bot'],
  ['AI_MEDIUM', 'Medium Bot'],
  ['AI_HARD', 'Hard Bot'],
]);

const cpuGameTypes = Array.from(cpuDisplayNames.keys());

const createRoom = async (data: CreateRoomArgs) => {
  const isCPU = cpuGameTypes.includes(data.gameType);
  const isLocal = data.gameType === 'LOCAL';

  try {
    const newGame = new GameModel({
      createdBy: data?.user?.id,
      whitePlayer: {
        userId: data?.user?.id,
        isCPU: false,
        displayName: data.user?.username,
      },
      blackPlayer: {
        displayName: isCPU ? cpuDisplayNames.get(data.gameType) : undefined,
        connectionStatus:
          isCPU || isLocal ? PlayerStatus.CONNECTED : PlayerStatus.DISCONNECTED,
        isCPU,
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

const getCurrentPlayer = (game: IGame | null): IPlayer | undefined => {
  const currentTurn = game?.turn;

  if (currentTurn === Cell.BLACK) {
    return game?.blackPlayer;
  }

  if (currentTurn === Cell.WHITE) {
    return game?.whitePlayer;
  }
};

const getNextTurn = (turn: PlayerColor): PlayerColor =>
  turn === Cell.WHITE ? Cell.BLACK : Cell.WHITE;

const playerMove = async ({
  roomId,
  move: {row, column},
  user,
}: PlayerMoveArgs) => {
  const game = await GameModel.findById(roomId);

  if (!game) {
    throw new Error(`Player Move Error: Room with id: ${roomId} not found...`);
  }

  const index = Number(`${row}${column}`);
  const currentTurn = game.turn as PlayerColor;
  const board = game.board;
  const currentPlayer = getCurrentPlayer(game);

  if (
    !currentPlayer?.isCPU &&
    isValid(index) &&
    isLegal(index, currentTurn, board)
  ) {
    if (
      game.type === 'LOCAL' ||
      currentPlayer?.userId?.toString() === user?.id
    ) {
      const newBoard = makeMove(index, currentTurn, board);

      // Update game after turn
      game.board = newBoard;
      game.turn = getNextTurn(currentTurn);
      game.validMoves = getLegalMoves(game.turn, game.board);
    }

    // Save game after player turn
    await game.save();

    if (cpuGameTypes.includes(game.type)) {
      const currentTurn = game.turn as PlayerColor;
      const board = game.board;

      const strategy = gameTypesToStrategy.get(game.type);

      const newBoard = await aiMove(game, {
        board,
        color: currentTurn as PlayerColor,
        strategy,
      });

      // Update game after ai move
      game.board = newBoard;
      game.turn = getNextTurn(game.turn as PlayerColor);
      game.validMoves = getLegalMoves(game.turn, game.board);

      await setTimeout(() => game.save(), AI_TIMEOUT);
    }
  }
};

const aiMove = async (game: IGame, data: AiBody): Promise<Board> => {
  const aiMoveIndex = await ai_play(data);
  return makeMove(aiMoveIndex, data.color, game.board);
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
