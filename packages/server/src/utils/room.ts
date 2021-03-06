import GameModel from '../models/Game';
import UserModel from '../models/User';
import {
  Board,
  Cell,
  CreateRoomArgs,
  EndGameStatus,
  GameStatus,
  GameType,
  IGame,
  IPlayer,
  JoinRoomArgs,
  LeaveRoomArgs,
  PlayerColor,
  PlayerMoveArgs,
  PlayerStatus,
  ServerEvents,
  User,
} from 'reversi-types';
import mongoose from 'mongoose';
import {emitEventToSocket} from './socket-service';
import {getSocketByUserId} from '../services/socket-manager';
import {ChangeEventCR, ChangeEventUpdate} from 'mongodb';
import {
  getBoardAfterMove,
  getGameResult,
  getLegalMoves,
  isLegal,
  isValid,
} from './game-rules';
import {ai_play, gameTypesToStrategy} from './ai/ai-api';
import {getSafeRoomCode} from './room-code-gen';

const AI_TIMEOUT = 1000;

const cpuDisplayNames: Map<GameType, string> = new Map([
  ['AI_EASY', 'Easy Bot'],
  ['AI_MEDIUM', 'Medium Bot'],
  ['AI_HARD', 'Hard Bot'],
  ['AI_EXPERT', 'Expert Bot'],
]);

const cpuGameTypes = Array.from(cpuDisplayNames.keys());

const createGame = async ({id, username}: User, gameType: GameType) => {
  const isCPU = cpuGameTypes.includes(gameType);
  const isLocal = gameType === 'LOCAL';
  const isOffline = isCPU || isLocal;
  const roomCode =
    gameType === 'PRIVATE_ROOM' ? await getSafeRoomCode() : undefined;

  const newGame = new GameModel({
    roomCode: roomCode,
    createdBy: id,
    whitePlayer: {
      userId: id,
      isCPU: false,
      displayName: username,
    },
    blackPlayer: {
      displayName: isCPU ? cpuDisplayNames.get(gameType) : undefined,
      connectionStatus: isOffline
        ? PlayerStatus.CONNECTED
        : PlayerStatus.DISCONNECTED,
      isCPU,
    },
    type: gameType,
  });

  try {
    await newGame.save();
    console.log(`Game Room of type ${gameType} created...`);
  } catch (e) {
    console.log(e);
  }
};

const createRoom = async ({user, gameType, roomCode}: CreateRoomArgs) => {
  if (!user) {
    throw new Error(`Game ERROR: User not found...`);
  }

  switch (gameType) {
    case 'AI_EASY':
    case 'AI_MEDIUM':
    case 'AI_HARD':
    case 'AI_EXPERT':
    case 'LOCAL':
      await createGame(user, gameType);
      break;
    case 'PRIVATE_ROOM':
      if (roomCode !== undefined) {
        const game = (
          await GameModel.find({roomCode, status: GameStatus.WAITING})
        )[0];

        if (game) {
          const socket = getSocketByUserId(user.id);

          if (socket) {
            emitEventToSocket(
              socket,
              ServerEvents.CreatedRoom,
              game.id.toString()
            );
          }
        }
      } else {
        await createGame(user, gameType);
      }

      break;
    case 'PUBLIC_ROOM':
      const [game] = await GameModel.find({
        type: gameType,
        status: GameStatus.WAITING,
      });

      if (game) {
        const socket = getSocketByUserId(user.id);

        if (socket) {
          emitEventToSocket(
            socket,
            ServerEvents.CreatedRoom,
            game.id.toString()
          );
        }
      } else {
        await createGame(user, gameType);
      }
      break;
  }
};

const isPlayerConnected = ({isCPU, connectionStatus}: IPlayer): boolean =>
  !isCPU && connectionStatus === PlayerStatus.CONNECTED;

const getPlayerFromGameByColor = (
  color: PlayerColor,
  {whitePlayer, blackPlayer}: IGame
): IPlayer | undefined => (color === Cell.WHITE ? whitePlayer : blackPlayer);

const getPlayerFromGameById = (
  id: string,
  {whitePlayer, blackPlayer}: IGame
): IPlayer | undefined => {
  if (whitePlayer?.userId?.toString() === id.toString()) {
    return whitePlayer;
  }

  if (blackPlayer?.userId?.toString() === id.toString()) {
    return blackPlayer;
  }
};

const updatePlayerConnectionInGame = (
  {id, username}: User,
  game: IGame,
  color: PlayerColor
): IGame => {
  const player = getPlayerFromGameByColor(color, game);

  if (player) {
    player.connectionStatus = PlayerStatus.CONNECTED;
    player.userId = id;
    player.displayName = username;
  }

  return game;
};

const connectPlayerToGame = async (user: User, game: IGame) => {
  const {whitePlayer, blackPlayer, status} = game;

  if (status === GameStatus.WAITING) {
    const isWhiteAvailable =
      whitePlayer && !whitePlayer.isCPU && !isPlayerConnected(whitePlayer);
    const isBlackAvailable =
      blackPlayer && !blackPlayer.isCPU && !isPlayerConnected(blackPlayer);

    if (isWhiteAvailable) {
      const updatedGame = updatePlayerConnectionInGame(user, game, Cell.WHITE);

      if (!isBlackAvailable) {
        updatedGame.status = GameStatus.PLAYING;
      }

      await updatedGame.save();
    } else if (isBlackAvailable) {
      const updatedGame = updatePlayerConnectionInGame(user, game, Cell.BLACK);

      if (!isWhiteAvailable) {
        updatedGame.status = GameStatus.PLAYING;
      }

      await updatedGame.save();
    }
  }
};

const joinRoom = async ({roomId, user}: JoinRoomArgs) => {
  if (!user) {
    throw new Error(`Game ERROR: Join room reached without valid user...`);
  }

  const game = await GameModel.findById(roomId);

  if (!game) {
    throw new Error(`Game ERROR: Room with id: ${roomId} not found...`);
  }

  await connectPlayerToGame(user, game);
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

const getNextTurn = (
  turn: PlayerColor,
  board: Board
): PlayerColor | undefined => {
  const nextTurn = turn === Cell.WHITE ? Cell.BLACK : Cell.WHITE;

  if (getLegalMoves(nextTurn, board).length > 0) {
    return nextTurn;
  } else if (getLegalMoves(turn, board).length > 0) {
    return turn;
  }

  return undefined;
};

const incrementUserStats = (
  id: any,
  gameId: string,
  color: PlayerColor,
  status: EndGameStatus
) => {
  UserModel.findById(id).then((user) => {
    if (user) {
      if (status === GameStatus.TIE) {
        user.stats.ties.push(gameId);
      } else {
        const isWin =
          (color === Cell.WHITE && status === GameStatus.WIN_WHITE) ||
          (color === Cell.BLACK && status === GameStatus.WIN_BLACK);

        if (isWin) {
          user.stats.wins.push(gameId);
        } else {
          user.stats.losses.push(gameId);
        }
      }

      return user.save();
    }
  });
};

const updateUserStats = (game: IGame) => {
  const whitePlayer = getPlayerFromGameByColor(Cell.WHITE, game);
  const blackPlayer = getPlayerFromGameByColor(Cell.BLACK, game);
  const {_id: gameId, status, type} = game;

  // Do not update stats for local games because they will be deleted
  if (type !== 'LOCAL') {
    if (
      ![GameStatus.WIN_BLACK, GameStatus.WIN_WHITE, GameStatus.TIE].includes(
        status
      )
    ) {
      throw new Error(
        `Game ERROR: trying to update users without valid game end state...`
      );
    }

    if (!whitePlayer || !blackPlayer) {
      throw new Error(`Game ERROR: players not valid...`);
    }

    const {userId: whiteId, isCPU: isWhiteCPU} = whitePlayer;
    const {userId: blackId, isCPU: isBlackCPU} = blackPlayer;

    !isWhiteCPU &&
      incrementUserStats(whiteId, gameId, Cell.WHITE, status as EndGameStatus);
    !isBlackCPU &&
      incrementUserStats(blackId, gameId, Cell.BLACK, status as EndGameStatus);
  }
};

const playerMove = async ({
  roomId,
  move: {row, column},
  user,
}: PlayerMoveArgs) => {
  const game = await GameModel.findById(roomId);

  if (!game) {
    throw new Error(`Game ERROR: Room with id: ${roomId} not found...`);
  }

  if (game.status !== GameStatus.PLAYING) {
    return;
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
      game.turn = getNextTurn(currentTurn, game.board);

      if (game.turn) {
        game.validMoves = getLegalMoves(game.turn, game.board);
      } else {
        game.validMoves = [];
        game.status = getGameResult(game.board);
        updateUserStats(game);
      }
    }

    // Save game after player turn
    await game.save();

    // If game.turn is undefined than the game is over
    if (game.turn !== currentTurn && cpuGameTypes.includes(game.type)) {
      const currentAITurn = game.turn;

      while (game.turn === currentAITurn) {
        const newBoard = await getBoardAfterAIMove(game);

        // Update game after ai move
        game.board = newBoard;
        game.turn = getNextTurn(game.turn as PlayerColor, game.board);

        if (game.turn) {
          game.validMoves = getLegalMoves(game.turn, game.board);
        } else {
          game.validMoves = [];
          game.status = getGameResult(game.board);
          updateUserStats(game);
          break;
        }
      }

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
      const player = getPlayerFromGameByColor(color, game);
      player && updateLeaveGame(player, game);
    }
  });
};

const disconnectUserFromGames = async (id: string) => {
  const userId = mongoose.Types.ObjectId(id);

  disconnectPlayerFromGames(userId, Cell.WHITE);
  disconnectPlayerFromGames(userId, Cell.BLACK);
};

const updateLeaveGame = (player: IPlayer, game: IGame) => {
  player.connectionStatus = PlayerStatus.DISCONNECTED;

  // If game status is waiting, just delete the game because it never started
  if (game.status === GameStatus.WAITING) {
    game.remove();
  } else {
    if (game.status === GameStatus.PLAYING) {
      game.status = GameStatus.WAITING;

      const {type} = game;
      switch (type) {
        case 'AI_EASY':
        case 'AI_MEDIUM':
        case 'AI_HARD':
        case 'AI_EXPERT':
        case 'PUBLIC_ROOM':
          // Automatic loss for leaving user
          const isWhiteLoss = player.userId === game.whitePlayer?.userId;
          game.status = isWhiteLoss
            ? GameStatus.WIN_BLACK
            : GameStatus.WIN_WHITE;
          updateUserStats(game);
          game.save();
          break;
        case 'PRIVATE_ROOM':
          // No delete or change
          game.save();
          break;
        case 'LOCAL':
          // Delete game
          game.remove();
          break;
      }
    }
  }
};

const leaveRoom = async ({roomId, user}: LeaveRoomArgs) => {
  if (!user) {
    throw new Error(`Game ERROR: User not found...`);
  }

  const game = await GameModel.findById(roomId);

  if (!game) {
    throw new Error(`Game ERROR: Room with id: ${roomId} not found...`);
  }

  const player = getPlayerFromGameById(user._id, game);
  player && updateLeaveGame(player, game);
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
  const player = getPlayerFromGameByColor(color, game);

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
  leaveRoom,
};
