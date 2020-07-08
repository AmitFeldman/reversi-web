import * as React from 'react';
import {
  createRoom,
  joinedRoom,
  onGameUpdated,
  onRoomCreated,
  playerMove,
} from '../utils/socket/game-api';
import {useAuth} from './AuthContext';
import {Board as IBoard, GameType, Move, PlayerColor} from 'reversi-types';
import {getInitialBoard} from '../utils/board-helper';

interface GameManagerContextData {
  inGame: boolean;
  gameId: string | undefined;
  turn: PlayerColor | undefined;
  board: IBoard;
  validMoves: Move[];
  startGame: (gameType: GameType) => void;
  leaveGame: () => void;
  getScore: (playerColor: PlayerColor) => number;
  playerMove: (row: number, column: number) => void;
}

const GameManagerContext = React.createContext<GameManagerContextData>({
  inGame: false,
  gameId: undefined,
  turn: undefined,
  board: getInitialBoard(),
  validMoves: [],
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
  const [validMoves, setValidMoves] = React.useState<Move[]>([]);

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
      const cancelOnGameUpdated = onGameUpdated(
        ({_id, board, turn, validMoves}) => {
          setBoard(board);
          setTurn(turn);
          setValidMoves(validMoves);
        }
      );

      return () => {
        cancelOnGameUpdated();
      };
    } else {
      setGameId(undefined);
      setTurn(undefined);
      setBoard(getInitialBoard());
      setValidMoves([]);
    }
  }, [inGame]);

  return (
    <GameManagerContext.Provider
      value={{
        inGame,
        gameId,
        board,
        validMoves,
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
        playerMove: (row, column) => {
          gameId &&
            playerMove({
              token: user?._id,
              roomId: gameId,
              move: {
                row,
                column,
              },
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
