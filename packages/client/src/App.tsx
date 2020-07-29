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
import {Cell} from 'reversi-types';

function App() {
  const {inGame, board, playerMove, validMoves, turn, isLocal} = useGameManager();
  const {controls} = useCamera();
  const {topDown, showValidMoves} = useOptions();

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
          disabled={!inGame && turn === Cell.WHITE}
          cells={board}
          showValidMoves={showValidMoves && (turn === Cell.WHITE || isLocal())}
          validMoves={validMoves}
          onCellClick={(r, c) => playerMove(r, c)}
        />
        <DiscLayer cells={board} />
      </Scene>

      <HeadsUpDisplay />
    </>
  );
}

export default App;
