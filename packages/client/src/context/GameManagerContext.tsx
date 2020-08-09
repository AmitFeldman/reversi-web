import * as React from 'react';
import {
  createRoom,
  joinedRoom,
  leaveRoom,
  onGameUpdated,
  onRoomCreated,
  playerMove,
} from '../utils/socket/game-api';
import {useAuth} from './AuthContext';
import {
  Board as IBoard,
  Cell,
  EndGameStatus,
  GameStatus,
  GameType,
  IGame,
  IPlayer,
  Move,
  PlayerColor,
  PlayerStatus,
} from 'reversi-types';
import {getInitialBoard} from '../utils/board-helper';
import Button from '../components/Button/Button';
import GameLoader from '../components/GameLoader/GameLoader';
import HUDModal from '../components/HUDModal/HUDModal';

interface GameManagerContextData {
  inGame: boolean;
  gameId: string | undefined;
  turn: PlayerColor | undefined;
  board: IBoard;
  validMoves: Move[];
  isLocal: () => boolean;
  getStatus: () => GameStatus | undefined;
  startGame: (gameType: GameType) => void;
  joinGame: (roomCode: string) => void;
  getRoomCode: () => string | undefined;
  leaveGame: () => void;
  getScore: (playerColor: PlayerColor) => number;
  getName: (playerColor: PlayerColor) => string;
  getEnemy: () => IPlayer | undefined;
  isUserTurn: () => boolean;
  playerMove: (row: number, column: number) => void;
}

const getGameOverText = (
  status: EndGameStatus,
  localUserColor: PlayerColor
): string => {
  if (status === GameStatus.TIE) {
    return 'Tie Game!';
  }

  if (
    (status === GameStatus.WIN_WHITE && localUserColor === Cell.WHITE) ||
    (status === GameStatus.WIN_BLACK && localUserColor === Cell.BLACK)
  ) {
    return 'Congratulations, You Won!';
  }

  return 'Better luck next time, You Lost...';
};

const getLeaveGameText = (
  type: GameType | undefined,
  status: GameStatus | undefined
): string => {
  if (status !== GameStatus.PLAYING) {
    return 'Are you sure?';
  }

  switch (type) {
    case 'AI_EASY':
    case 'AI_MEDIUM':
    case 'AI_HARD':
    case 'AI_EXPERT':
    case 'PUBLIC_ROOM':
      return 'Leaving the game will count as a loss, are you sure?';
    default:
      return 'Are you sure?';
  }
};

const GameManagerContext = React.createContext<GameManagerContextData>({
  inGame: false,
  gameId: undefined,
  turn: undefined,
  board: getInitialBoard(),
  validMoves: [],
  isLocal: () => false,
  getStatus: () => undefined,
  startGame: () => {},
  getRoomCode: () => undefined,
  joinGame: () => {},
  leaveGame: () => {},
  getScore: () => 0,
  isUserTurn: () => false,
  getName: () => 'Guest',
  getEnemy: () => undefined,
  playerMove: () => {},
});

const GameManagerProvider: React.FC = ({children}) => {
  const {user} = useAuth();

  // Game State
  const [inGame, setInGame] = React.useState<boolean>(false);
  const [gameId, setGameId] = React.useState<string | undefined>();
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
  const [game, setGame] = React.useState<IGame | undefined>();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const getLocalUserColor = (): PlayerColor | null => {
    if (inGame && game) {
      const isWhite = game.whitePlayer?.userId === user?._id;

      return isWhite ? Cell.WHITE : Cell.BLACK;
    }

    return null;
  };

  const isUserTurn = () => getLocalUserColor() === game?.turn;

  React.useEffect(() => {
    const cancelOnRoomCreated = onRoomCreated((newRoomId) => {
      setGameId(newRoomId);
      joinedRoom({token: user?._id, roomId: newRoomId});

      setInGame(true);
    });

    return () => {
      cancelOnRoomCreated();
    };
  }, [user]);

  React.useEffect(() => {
    if (inGame) {
      const cancelOnGameUpdated = onGameUpdated((game) => {
        if (
          [GameStatus.TIE, GameStatus.WIN_WHITE, GameStatus.WIN_BLACK].includes(
            game.status
          )
        ) {
          setIsGameOver(true);
        }

        setGame(game);
      });

      return () => {
        cancelOnGameUpdated();
      };
    } else {
      setGameId(undefined);
      setGame(undefined);
      setIsGameOver(false);
    }
  }, [inGame]);

  return (
    <GameManagerContext.Provider
      value={{
        inGame,
        gameId,
        board: game?.board ? game.board : getInitialBoard(),
        validMoves: game?.validMoves ? game.validMoves : [],
        turn: game?.turn,
        getStatus: () => (inGame && game ? game.status : undefined),
        startGame: (gameType) => {
          createRoom({
            token: user?._id,
            gameType,
          });
        },
        joinGame: (roomCode) =>
          createRoom({
            token: user?._id,
            gameType: 'PRIVATE_ROOM',
            roomCode,
          }),
        isLocal: () => game?.type === 'LOCAL',
        getScore: (color) =>
          game?.board ? game.board.filter((c) => c === color).length : 0,
        getName: (color) => {
          const player =
            color === Cell.WHITE ? game?.whitePlayer : game?.blackPlayer;
          const name = player?.displayName;

          return name && player?.connectionStatus === PlayerStatus.CONNECTED
            ? name
            : '. . .';
        },
        getRoomCode: () =>
          game?.type === 'PRIVATE_ROOM' ? game?.roomCode : undefined,
        isUserTurn,
        getEnemy: () =>
          getLocalUserColor() === Cell.WHITE
            ? game?.blackPlayer
            : game?.whitePlayer,
        playerMove: (row, column) => {
          if (game?.type === 'LOCAL' || game?.turn === getLocalUserColor()) {
            gameId &&
              playerMove({
                token: user?._id,
                roomId: gameId,
                move: {
                  row,
                  column,
                },
              });
          }
        },
        leaveGame: () => {
          if (inGame) {
            setModalOpen(true);
          }
        },
      }}>
      <HUDModal
        style={{content: {margin: '15% 40%', width: '20%'}}}
        isOpen={modalOpen || isGameOver}
        closeButton={!isGameOver}
        onRequestClose={() => setModalOpen(false)}>
        <p className="text-lg text-black mb-4 break-words">
          {isGameOver
            ? getGameOverText(
                game?.status as EndGameStatus,
                getLocalUserColor() as PlayerColor
              )
            : getLeaveGameText(game?.type, game?.status)}
        </p>
        <Button
          className="m-2"
          onClick={() => {
            gameId && leaveRoom({token: user?._id, roomId: gameId});
            setInGame(false);
            setModalOpen(false);
          }}>
          Leave Game
        </Button>
      </HUDModal>

      {!isGameOver && <GameLoader />}
      {children}
    </GameManagerContext.Provider>
  );
};

const useGameManager = () => {
  const context = React.useContext(GameManagerContext);

  if (context === undefined) {
    throw new Error(`useGameManager must be used within a GameManagerProvider`);
  }

  return context;
};

export {GameManagerProvider, useGameManager};
