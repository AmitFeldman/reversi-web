import React from 'react';
import Scene from './components/Scene/Scene';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import CameraControls from './components/Camera/Camera';
import {AppState} from './context/AppContext';
import Board from './components/Board/Board';
import Modal from 'react-modal';
import UserInterface from './components/UserInterface/UserInterface';

function App() {
  const controls = React.useRef<OrbitControls>();
  const [state, setState] = React.useState<AppState>(AppState.MAIN_MENU);

  // Setup for react-modal
  React.useEffect(() => {
    Modal.setAppElement('#reversi-web-app');
  }, []);

  return (
    <div id="reversi-web-app">
      <Scene>
        <CameraControls controls={controls} state={state} />
        <Board />
      </Scene>

      <UserInterface
        appState={state}
        setAppState={(state) => setState(state)}
        cameraControls={controls.current}
      />
    </div>
  );
}

export default App;
