import * as React from 'react';
import UserControls from '../UserControls/UserControls';
import {useAuth} from '../../context/AuthContext';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {AppState} from '../../context/AppContext';
import InGameHud from '../InGameHUD/InGameHUD';
import Modal from 'react-modal';
import Menu from '../Menu/Menu';
import {PlayerColor} from 'reversi-types';
import {emitCreateRoom, emitJoinedRoom} from '../../utils/client-events';

const DEFAULT_USERNAME = 'Guest';

interface HeadsUpDisplayProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
  cameraControls: undefined | OrbitControls;
  scoreBlack: number;
  scoreWhite: number;
  turn: PlayerColor | undefined;
  roomId: string;
  setRoomId: (newRoomId: string) => void;
}

const HeadsUpDisplay: React.FC<HeadsUpDisplayProps> = ({
  appState,
  setAppState,
  cameraControls,
  scoreBlack,
  scoreWhite,
  turn,
  roomId,
  setRoomId,
}) => {
  const {user, isUserLoggedIn} = useAuth();
  const [showMenu, setShowMenu] = React.useState<boolean>(false);

  const beginGame = () => {
    setAppState(AppState.IN_GAME);
    setShowMenu(false);
  };

  return (
    <>
      <div className="absolute right-0 top-0 p-2">
        <p className="text-white">
          {appState === AppState.MAIN_MENU ? 'Welcome' : 'Good luck'},{' '}
          {isUserLoggedIn() ? user?.username : DEFAULT_USERNAME}!
        </p>
      </div>

      {appState === AppState.IN_GAME && (
        <InGameHud
          turn={turn}
          scoreWhite={scoreWhite}
          scoreBlack={scoreBlack}
          onResetCameraClick={() => cameraControls && cameraControls.reset()}
          onLeaveGame={() => setAppState(AppState.MAIN_MENU)}
        />
      )}

      {appState === AppState.MAIN_MENU && (
        <>
          <div className="absolute right-0 top-0 pt-8">
            <UserControls />
          </div>

          <div className="absolute top-0 left-0 text-white p-8 pl-12">
            <p className="text-6xl">Reversi</p>
            <p
              className="text-3xl cursor-pointer hover:text-black"
              onClick={() => {
                emitCreateRoom({
                  token: user?._id,
                  gameType: 'AI_EASY',
                });
                // setAppState(AppState.IN_GAME);
                setShowMenu(true);
              }}>
              Play
            </p>
            <p
              className="text-3xl"
              onClick={() => {
                emitJoinedRoom({token: user?._id, roomId});
                setAppState(AppState.IN_GAME);
              }}>
              Join Game
            </p>
            <input
              className="text-black"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
            />
          </div>
        </>
      )}

      <Modal
        className="absolute top-0 bg-white shadow-md rounded px-8 pb-8 pt-3 float-left m-5"
        overlayClassName=""
        isOpen={showMenu}
        onRequestClose={() => setShowMenu(false)}>
        <Menu beginGame={beginGame} />
      </Modal>
    </>
  );
};

export default HeadsUpDisplay;
