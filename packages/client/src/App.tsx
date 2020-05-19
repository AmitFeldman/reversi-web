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
import {DiscType} from './components/Disc/Disc';

function App() {
  const controls = React.useRef<OrbitControls>();
  const [state, setState] = React.useState<AppState>(AppState.MAIN_MENU);
  const [turn, setTurn] = React.useState<DiscType>(CellState.WHITE);
  const [board, setBoard] = React.useState<CellState[]>(
    new Array(64).fill(CellState.EMPTY)
  );

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
          onCellClick={(index) => {
            setTurn((t) =>
              t === CellState.WHITE ? CellState.BLACK : CellState.WHITE
            );
            setBoard((board) => [
              ...board.slice(0, index),
              turn,
              ...board.slice(index + 1),
            ]);
          }}
        />
        <DiscLayer cells={board} />
      </Scene>

      <HeadsUpDisplay
        scoreBlack={board.filter((state) => state === CellState.BLACK).length}
        scoreWhite={board.filter((state) => state === CellState.WHITE).length}
        turn={turn}
        appState={state}
        setAppState={(state) => setState(state)}
        cameraControls={controls.current}
      />
    </>
  );
}

export default App;
