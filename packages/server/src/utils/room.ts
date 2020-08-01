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
import {getBoardAfterMove, getLegalMoves, isLegal, isValid} from './game-rules';
import {ai_play, gameTypesToStrategy} from './ai/ai-api';

const AI_TIMEOUT = 1000;

const cpuDisplayNames: Map<GameType, string> = new Map([
  ['AI_EASY', 'Easy Bot'],
  ['AI_MEDIUM', 'Medium Bot'],
  ['AI_HARD', 'Hard Bot'],
]);

const cpuGameTypes = Array.from(cpuDisplayNames.keys());

const createRoom = async ({user, gameType}: CreateRoomArgs) => {
  if (!user) {
    throw new Error(`Game ERROR: User not found...`);
  }

  const isCPU = cpuGameTypes.includes(gameType);
  const isLocal = gameType === 'LOCAL';

  try {
    const newGame = new GameModel({
      createdBy: user.id,
      whitePlayer: {
        userId: user.id,
        isCPU: false,
        displayName: user.username,
      },
      blackPlayer: {
        displayName: isCPU ? cpuDisplayNames.get(gameType) : undefined,
        connectionStatus:
          isCPU || isLocal ? PlayerStatus.CONNECTED : PlayerStatus.DISCONNECTED,
        isCPU,
      },
      type: gameType,
    });

    console.log(`Game Room of type ${gameType} created...`);
    await newGame.save();
  } catch (e) {
    console.log(e);
  }
};

const isPlayerConnected = ({isCPU, connectionStatus}: IPlayer): boolean =>
  !isCPU && connectionStatus === PlayerStatus.CONNECTED;

const getPlayerFromGame = (
  color: PlayerColor,
  game: IGame
): IPlayer | undefined =>
  color === Cell.WHITE ? game.whitePlayer : game.blackPlayer;

const connectPlayerToGame = async (
  playerId: string,
  game: IGame,
  color: PlayerColor
) => {
  const player = getPlayerFromGame(color, game);

  if (player) {
    player.connectionStatus = PlayerStatus.CONNECTED;
    player.userId = playerId;
    await game.save();
  }
};

const joinRoom = async ({roomId, user}: JoinRoomArgs) => {
  const game = await GameModel.findById(roomId);

  if (!game) {
    throw new Error(`Game ERROR: Room with id: ${roomId} not found...`);
  }

  const {whitePlayer, blackPlayer} = game;

  if (whitePlayer && !isPlayerConnected(whitePlayer)) {
    await connectPlayerToGame(user?.id, game, Cell.WHITE);
  } else if (blackPlayer && !isPlayerConnected(blackPlayer)) {
    await connectPlayerToGame(user?.id, game, Cell.BLACK);
  }
};

const getCurrentTurnPlayer = (game: IGame | null): IPlayer | undefined => {
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
    throw new Error(`Game ERROR: Room with id: ${roomId} not found...`);
  }

  const index = Number(`${row}${column}`);
  const currentTurn = game.turn as PlayerColor;
  const board = game.board;
  const currentPlayer = getCurrentTurnPlayer(game);

  if (
    !currentPlayer?.isCPU &&
    isValid(index) &&
    isLegal(index, currentTurn, board)
  ) {
    if (
      game.type === 'LOCAL' ||
      currentPlayer?.userId?.toString() === user?.id
    ) {
      const newBoard = getBoardAfterMove(index, currentTurn, board);

      // Update game after turn
      game.board = newBoard;
      game.turn = getNextTurn(currentTurn);
      game.validMoves = getLegalMoves(game.turn, game.board);
    }

    // Save game after player turn
    await game.save();

    if (cpuGameTypes.includes(game.type)) {
      const newBoard = await getBoardAfterAIMove(game);

      // Update game after ai move
      game.board = newBoard;
      game.turn = getNextTurn(game.turn as PlayerColor);
      game.validMoves = getLegalMoves(game.turn, game.board);

      await setTimeout(() => game.save(), AI_TIMEOUT);
    }
  }
};

const getBoardAfterAIMove = async (game: IGame): Promise<Board> => {
  const currentTurn = game.turn as PlayerColor;
  const board = game.board;

  const strategy = gameTypesToStrategy.get(game.type);

  const aiMoveIndex = await ai_play({
    board,
    color: currentTurn as PlayerColor,
    strategy,
  });

  return getBoardAfterMove(aiMoveIndex, currentTurn, game.board);
};

const disconnectPlayerFromGames = async (
  id: mongoose.Types.ObjectId,
  color: PlayerColor
) => {
  const playerPath = color === Cell.WHITE ? 'whitePlayer' : 'blackPlayer';

  const games = await GameModel.find({
    $and: [
      {[`${playerPath}.userId`]: id},
      {[`${playerPath}.connectionStatus`]: PlayerStatus.CONNECTED},
    ],
  });

  games.forEach((game) => {
    if (game) {
      const player = getPlayerFromGame(color, game);

      if (player) {
        player.connectionStatus = PlayerStatus.DISCONNECTED;
        game.save();
      }
    }
  });
};

const disconnectUserFromGames = async (id: string) => {
  const userId = mongoose.Types.ObjectId(id);

  disconnectPlayerFromGames(userId, Cell.WHITE);
  disconnectPlayerFromGames(userId, Cell.BLACK);
};

const onNewGame = (change: ChangeEventCR<IGame>) => {
  const game = change?.fullDocument;

  if (!game) {
    throw new Error(`Game ERROR: Create Event document not valid...`);
  }

  const {createdBy, _id} = game;
  const socket = createdBy ? getSocketByUserId(createdBy) : undefined;

  if (socket) {
    emitEventToSocket(socket, ServerEvents.CreatedRoom, _id.toString());
  }
};

const emitUpdateToPlayerInGame = (game: IGame, color: PlayerColor) => {
  const player = getPlayerFromGame(color, game);

  if (player && isPlayerConnected(player) && player.userId) {
    const playerSocket = getSocketByUserId(player.userId.toString());

    if (playerSocket) {
      console.log(
        `Game Update emitted to socket: ${playerSocket.id} in game id: ${game._id}...`
      );
      emitEventToSocket(playerSocket, ServerEvents.GameUpdated, game);
    }
  }
};

const onGameUpdate = (change: ChangeEventUpdate<IGame>) => {
  const game = change?.fullDocument;

  if (!game) {
    throw new Error(`Game ERROR: Update Event document not valid...`);
  }

  emitUpdateToPlayerInGame(game, Cell.WHITE);
  emitUpdateToPlayerInGame(game, Cell.BLACK);
};

export {
  createRoom,
  joinRoom,
  playerMove,
  disconnectUserFromGames,
  onNewGame,
  onGameUpdate,
};
