import * as React from 'react';
import UserControls from '../UserControls/UserControls';
import {useAuth} from '../../context/AuthContext';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import IconButton from '../IconButton/IconButton';
import {AppState} from '../../context/AppContext';
import {TiArrowBack} from 'react-icons/ti';
import {IoMdReverseCamera} from 'react-icons/io';
import {FaCircle} from 'react-icons/fa';

const DEFAULT_USERNAME = 'Guest';

interface HeadsUpDisplayProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
  cameraControls: undefined | OrbitControls;
  scoreBlack: number;
  scoreWhite: number;
}

const HeadsUpDisplay: React.FC<HeadsUpDisplayProps> = ({
  appState,
  setAppState,
  cameraControls,
  scoreBlack,
  scoreWhite,
}) => {
  const {user, isUserLoggedIn} = useAuth();

  return (
    <>
      <div className="absolute top-0 left-0">
        <IconButton
          onClick={() =>
            appState === AppState.MAIN_MENU
              ? setAppState(AppState.IN_GAME)
              : setAppState(AppState.MAIN_MENU)
          }
          tooltipText="Leave Game">
          <TiArrowBack />
        </IconButton>

        <IconButton
          onClick={() => cameraControls && cameraControls.reset()}
          tooltipText="Reset Camera">
          <IoMdReverseCamera />
        </IconButton>
      </div>

      <div className="absolute right-0 top-0 p-2">
        <p className="text-white">
          Welcome, {isUserLoggedIn() ? user?.username : DEFAULT_USERNAME}!
        </p>
      </div>

      <div className="absolute right-0 top-0 pt-8">
        <UserControls />
      </div>

      <div className="text-black absolute top-0 left-25 pt-4">
        <p className="text-xl">
          Black Player <FaCircle className="float-left m-2" />
        </p>
        <p className="text-6xl">{scoreBlack}</p>
      </div>

      <div className="text-white absolute top-0 right-25 pt-4">
        <p className="text-xl">
          White Player <FaCircle className="float-left m-2" />
        </p>
        <p className="text-6xl">{scoreWhite}</p>
      </div>
    </>
  );
};

export default HeadsUpDisplay;
