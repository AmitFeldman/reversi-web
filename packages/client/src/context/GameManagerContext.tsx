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
  GameStatus,
  GameType,
  IGame,
  IPlayer,
  Move,
  PlayerColor,
} from 'reversi-types';
import {getInitialBoard} from '../utils/board-helper';
import Modal from 'react-modal';
import {GrClose} from 'react-icons/gr';
import Button from '../components/Button/Button';
import GameLoader from '../components/GameLoader/GameLoader';

interface GameManagerContextData {
  inGame: boolean;
  gameId: string | undefined;
  turn: PlayerColor | undefined;
  board: IBoard;
  validMoves: Move[];
  isLocal: () => boolean;
  getStatus: () => GameStatus | undefined;
  startGame: (gameType: GameType) => void;
  joinGame: (roomId: string) => void;
  leaveGame: () => void;
  getScore: (playerColor: PlayerColor) => number;
  getName: (playerColor: PlayerColor) => string;
  getEnemy: () => IPlayer | undefined;
  isUserTurn: () => boolean;
  playerMove: (row: number, column: number) => void;
}

const GameManagerContext = React.createContext<GameManagerContextData>({
  inGame: false,
  gameId: undefined,
  turn: undefined,
  board: getInitialBoard(),
  validMoves: [],
  isLocal: () => false,
  getStatus: () => undefined,
  startGame: () => {},
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
        setGame(game);
      });

      return () => {
        cancelOnGameUpdated();
      };
    } else {
      setGameId(undefined);
      setGame(undefined);
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
        joinGame: (roomId) =>
          createRoom({
            token: user?._id,
            gameType: 'PRIVATE_ROOM',
            joinRoomId: roomId,
          }),
        isLocal: () => game?.type === 'LOCAL',
        getScore: (color) =>
          game?.board ? game.board.filter((c) => c === color).length : 0,
        getName: (color) => {
          const player =
            color === Cell.WHITE ? game?.whitePlayer : game?.blackPlayer;
          const name = player?.displayName;

          return name ? name : '';
        },
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
      <Modal
        style={{overlay: {zIndex: 1000}}}
        className="absolute bg-white shadow-md rounded px-8 pb-8 pt-3 m-5 outline-none"
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}>
        <GrClose
          className="float-right -mr-5 cursor-pointer"
          onClick={() => setModalOpen(false)}
        />
        <p className="text-lg text-black mb-4">Are you sure?</p>
        <Button
          className="m-2"
          onClick={() => {
            gameId && leaveRoom({token: user?._id, roomId: gameId});
            setInGame(false);
            setModalOpen(false);
          }}>
          Leave Game
        </Button>
      </Modal>

      <GameLoader />
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
