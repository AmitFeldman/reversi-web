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
import {CellState} from './components/Cell/Cell';

function App() {
  const controls = React.useRef<OrbitControls>();
  const [state, setState] = React.useState<AppState>(AppState.MAIN_MENU);
  const [board, setBoard] = React.useState<CellState[]>(
    new Array(64).fill(CellState.EMPTY)
  );

  // Setup for react-modal
  React.useEffect(() => {
    Modal.setAppElement('#reversi-web-app');
  }, []);

  return (
    <div id="reversi-web-app">
      <Scene>
        <CameraControls controls={controls} state={state} />
        <Board />

        <CellLayer
          cells={board}
          onCellClick={(index) =>
            setBoard((board) => [
              ...board.slice(0, index),
              Math.random() < 0.5 ? CellState.WHITE : CellState.BLACK,
              ...board.slice(index + 1),
            ])
          }
        />
        <DiscLayer cells={board} />
      </Scene>

      <HeadsUpDisplay
        scoreBlack={board.filter((state) => state === CellState.BLACK).length}
        scoreWhite={board.filter((state) => state === CellState.WHITE).length}
        appState={state}
        setAppState={(state) => setState(state)}
        cameraControls={controls.current}
      />
    </div>
  );
}

export default App;
