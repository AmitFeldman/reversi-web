import React from 'react';
import Game from './components/Game/Game';
import IconButton from './components/IconButton/IconButton';
import {TiArrowBack} from 'react-icons/ti';
import {IoMdReverseCamera} from 'react-icons/io';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import CameraControls from './components/Camera/Camera';
import {AppState, useAppData} from './context/AppContext';
import UserControls from './components/UserControls/UserControls';

function App() {
  const controls = React.useRef<OrbitControls>();
  const {setStateInGame} = useAppData();
  const [state, setState] = React.useState<AppState>(AppState.MAIN_MENU);

  return (
    <div>
      <Game>
        <CameraControls controls={controls} state={state} />
      </Game>

      <div className="absolute top-0 left-0">
        <IconButton
          onClick={() =>
            state === AppState.MAIN_MENU
              ? setState(AppState.IN_GAME)
              : setState(AppState.MAIN_MENU)
          }
          tooltipText="Leave Game">
          <TiArrowBack />
        </IconButton>

        <IconButton
          onClick={() => controls.current && controls.current.reset()}
          tooltipText="Reset Camera">
          <IoMdReverseCamera />
        </IconButton>
      </div>

      <div className="absolute top-0 right-0">
        <UserControls />
      </div>

      <div className="absolute top-0 left-25">
        <h1>Black</h1>
      </div>

      <div className="absolute top-0 right-25">
        <h1>White</h1>
      </div>
    </div>
  );
}

export default App;
