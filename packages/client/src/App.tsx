import React from 'react';
import Scene from './components/Scene/Scene';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import CameraControls from './components/Camera/Camera';
import {AppState} from './context/AppContext';
import Board from './components/Board/Board';
import Modal from 'react-modal';
import HeadsUpDisplay from './components/HeadsUpDisplay/HeadsUpDisplay';
import CellLayer from './components/CellsLayer/CellsLayer';
import DiscLayer from './components/DiscsLayer/DiscLayer';
import {useAuth} from './context/AuthContext';
import {Cell, Board as IBoard, PlayerColor} from 'reversi-types';
import {
  joinRoom,
  playerMove,
  onGameUpdated,
  onRoomCreated,
} from './utils/socket/game-api';

function App() {
  const {user} = useAuth();
  const controls = React.useRef<OrbitControls>();
  const [state, setState] = React.useState<AppState>(AppState.MAIN_MENU);
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
      setBoard(board);
      setTurn(turn);
    });

    return () => {
      cancelOnRoomCreated();
      cancelOnGameUpdated();
    };
  }, []);

  // Reset Camera when going into game
  React.useEffect(() => {
    if (state === AppState.IN_GAME) {
      controls.current && controls.current.reset();
    }
  }, [state]);

  // Setup for react-modal
  React.useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  return (
    <>
      <Scene>
        <CameraControls controls={controls} state={state} />
        <Board />

        <CellLayer
          disabled={state === AppState.MAIN_MENU}
          cells={board}
          onCellClick={(index) =>
            playerMove({
              token: user?._id,
              roomId,
              moveId: index,
            })
          }
        />
        <DiscLayer cells={board} />
      </Scene>

      <HeadsUpDisplay
        scoreBlack={board.filter((state) => state === Cell.BLACK).length}
        scoreWhite={board.filter((state) => state === Cell.WHITE).length}
        turn={turn}
        appState={state}
        setAppState={(state) => setState(state)}
        cameraControls={controls.current}
        roomId={roomId}
        setRoomId={setRoomId}
      />
    </>
  );
}

export default App;
