import React from 'react';
import Scene from './components/Scene/Scene';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import CameraControls from './components/Camera/Camera';
import {AppState, useAppData} from './context/AppContext';
import Board from './components/Board/Board';
import Modal from 'react-modal';
import HeadsUpDisplay from './components/HeadsUpDisplay/HeadsUpDisplay';
import CellLayer from './components/CellsLayer/CellsLayer';
import DiscLayer from './components/DiscsLayer/DiscLayer';
import {useAuth} from './context/AuthContext';
import {Board as IBoard, Cell, PlayerColor} from 'reversi-types';
import {
  joinRoom,
  onGameUpdated,
  onRoomCreated,
  playerMove,
} from './utils/socket/game-api';

const INITIAL_BOARD = new Array<Cell>(64).fill(Cell.EMPTY);
INITIAL_BOARD[27] = INITIAL_BOARD[36] = Cell.BLACK;
INITIAL_BOARD[28] = INITIAL_BOARD[35] = Cell.WHITE;

function App() {
  const {appState} = useAppData();

  const {user} = useAuth();
  const controls = React.useRef<OrbitControls>();
  const [turn, setTurn] = React.useState<PlayerColor | undefined>();
  const [roomId, setRoomId] = React.useState<string>('');
  const [board, setBoard] = React.useState<IBoard>(
    new Array(64).fill(Cell.EMPTY)
  );

  React.useEffect(() => {
    const cancelOnRoomCreated = onRoomCreated((newRoomId) => {
      setRoomId(newRoomId);
      joinRoom({token: user?._id, roomId: newRoomId});
    });

    const cancelOnGameUpdated = onGameUpdated(({_id, board, turn}) => {
      setRoomId(_id);
      setBoard(board.filter((value, index) => index >= 11 && index <= 89 && index % 10 >= 1 && index % 10 <= 8));
      setTurn(turn);
    });

    return () => {
      cancelOnRoomCreated();
      cancelOnGameUpdated();
    };
  }, []);

  // Reset Camera when going into game
  React.useEffect(() => {
    if (appState === AppState.IN_GAME) {
      controls.current && controls.current.reset();
    }
  }, [appState]);

  // Setup for react-modal
  React.useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  return (
    <>
      <Scene>
        <CameraControls
          controls={controls}
          enabled={appState === AppState.IN_GAME}
        />
        <Board />

        <CellLayer
          disabled={appState === AppState.MAIN_MENU}
          cells={appState === AppState.MAIN_MENU ? INITIAL_BOARD : board}
          onCellClick={(index) =>
            playerMove({
              token: user?._id,
              roomId,
              moveId: index,
            })
          }
        />
        <DiscLayer cells={appState === AppState.MAIN_MENU ? INITIAL_BOARD : board} />
      </Scene>

      <HeadsUpDisplay
        scoreBlack={board.filter((state) => state === Cell.BLACK).length}
        scoreWhite={board.filter((state) => state === Cell.WHITE).length}
        turn={turn}
        cameraControls={controls.current}
        roomId={roomId}
        setRoomId={setRoomId}
      />
    </>
  );
}

export default App;
