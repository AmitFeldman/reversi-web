import React from 'react';
import Scene from './components/Scene/Scene';
import CameraControls from './components/Camera/Camera';
import Board from './components/Board/Board';
import Modal from 'react-modal';
import HeadsUpDisplay from './components/HeadsUpDisplay/HeadsUpDisplay';
import CellLayer from './components/CellsLayer/CellsLayer';
import DiscLayer from './components/DiscsLayer/DiscLayer';
import {useCamera} from './context/CameraContext';
import {useOptions} from './context/OptionsContext';
import {useGameManager} from './context/GameManagerContext';

function App() {
  const {inGame, board, playerMove} = useGameManager();
  const {controls} = useCamera();
  const {topDown} = useOptions();

  // Setup for react-modal
  React.useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  return (
    <>
      <Scene>
        <CameraControls
          controls={controls}
          enabled={inGame && !topDown}
          autoRotate={!inGame}
          topDown={inGame ? topDown : false}
        />
        <Board />

        <CellLayer
          disabled={!inGame}
          cells={board}
          onCellClick={(index) => playerMove(index)}
        />
        <DiscLayer cells={board} />
      </Scene>

      <HeadsUpDisplay />
    </>
  );
}

export default App;
