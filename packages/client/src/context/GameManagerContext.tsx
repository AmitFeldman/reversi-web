import * as React from 'react';
import {
  createRoom,
  joinedRoom,
  onGameUpdated,
  onRoomCreated,
  playerMove,
} from '../utils/socket/game-api';
import {useAuth} from './AuthContext';
import {Board as IBoard, GameType, PlayerColor} from 'reversi-types';
import {getInitialBoard} from '../utils/game-helper';

interface GameManagerContextData {
  inGame: boolean;
  gameId: string | undefined;
  turn: PlayerColor | undefined;
  board: IBoard;
  startGame: (gameType: GameType) => void;
  leaveGame: () => void;
  getScore: (playerColor: PlayerColor) => number;
  playerMove: (boardIndex: number) => void;
}

const GameManagerContext = React.createContext<GameManagerContextData>({
  inGame: false,
  gameId: undefined,
  turn: undefined,
  board: getInitialBoard(),
  startGame: () => {},
  leaveGame: () => {},
  getScore: () => 0,
  playerMove: () => {},
});

const GameManagerProvider: React.FC = ({children}) => {
  const {user} = useAuth();

  // Game State
  const [inGame, setInGame] = React.useState<boolean>(false);
  const [gameId, setGameId] = React.useState<string | undefined>();
  const [turn, setTurn] = React.useState<PlayerColor | undefined>();
  const [board, setBoard] = React.useState<IBoard>(getInitialBoard());

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
      const cancelOnGameUpdated = onGameUpdated(({_id, board, turn}) => {
        setBoard(board);
        setTurn(turn);
      });

      return () => {
        cancelOnGameUpdated();
      };
    } else {
      setGameId(undefined);
      setTurn(undefined);
      setBoard(getInitialBoard());
    }
  }, [inGame]);

  return (
    <GameManagerContext.Provider
      value={{
        inGame,
        gameId,
        board,
        turn,
        startGame: (gameType) => {
          switch (gameType) {
            case 'PRIVATE_ROOM':
              break;

            case 'AI_EASY':
            case 'AI_MEDIUM':
            case 'AI_HARD':
              createRoom({
                token: user?._id,
                gameType,
              });
              break;

            case 'LOCAL':
              break;
          }
        },
        leaveGame: () => setInGame(false),
        getScore: (color) => board.filter((c) => c === color).length,
        playerMove: (index) => {
          gameId &&
            playerMove({
              token: user?._id,
              roomId: gameId,
              moveId: index,
            });
        },
      }}>
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
