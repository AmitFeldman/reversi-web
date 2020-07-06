import * as React from 'react';
import UserControls from '../UserControls/UserControls';
import {useAuth} from '../../context/AuthContext';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {AppState, useAppData} from '../../context/AppContext';
import InGameHud from '../InGameHUD/InGameHUD';
import {PlayerColor} from 'reversi-types';
import {createRoom, joinRoom} from '../../utils/socket/game-api';

const DEFAULT_USERNAME = 'Guest';

interface HeadsUpDisplayProps {
  cameraControls: undefined | OrbitControls;
  scoreBlack: number;
  scoreWhite: number;
  turn: PlayerColor | undefined;
  roomId: string;
  setRoomId: (newRoomId: string) => void;
}

const HeadsUpDisplay: React.FC<HeadsUpDisplayProps> = ({
  cameraControls,
  scoreBlack,
  scoreWhite,
  turn,
  roomId,
  setRoomId,
}) => {
  const {user, isUserLoggedIn} = useAuth();
  const {appState, setAppState} = useAppData();

  return (
    <>
      <div className="absolute right-0 top-0 p-2">
        <p className="text-white">
          {appState === AppState.MAIN_MENU ? 'Login or Register to Play' : 'Good luck'},{' '}
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

          <div className="absolute top-0 left-0 text-white p-8">
            <p className="text-6xl">Reversi</p>
            <p
              className="text-3xl"
              onClick={() => {
                createRoom({
                  token: user?._id,
                  gameType: 'AI_EASY',
                });
                setAppState(AppState.IN_GAME);
              }}>
              Play
            </p>
            <p
              className="text-3xl"
              onClick={() => {
                joinRoom({token: user?._id, roomId});
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
    </>
  );
};

export default HeadsUpDisplay;
