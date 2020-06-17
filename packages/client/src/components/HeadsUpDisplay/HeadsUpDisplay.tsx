import * as React from 'react';
import UserControls from '../UserControls/UserControls';
import {useAuth} from '../../context/AuthContext';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {AppState} from '../../context/AppContext';
import {DiscType} from '../Disc/Disc';
import InGameHud from '../InGameHUD/InGameHUD';
import {emitEvent, onSocketEvent} from '../../utils/socket-client';
import {ClientEvents, ServerEvents} from 'reversi-types';

const DEFAULT_USERNAME = 'Guest';

interface HeadsUpDisplayProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
  cameraControls: undefined | OrbitControls;
  scoreBlack: number;
  scoreWhite: number;
  turn: DiscType;
}

const HeadsUpDisplay: React.FC<HeadsUpDisplayProps> = ({
  appState,
  setAppState,
  cameraControls,
  scoreBlack,
  scoreWhite,
  turn,
}) => {
  const {user, isUserLoggedIn} = useAuth();
  const [roomId, setRoomId] = React.useState<string>('');

  onSocketEvent(ServerEvents.CreatedRoom, (roomId: string) => {
    console.log(roomId);
    emitEvent(ClientEvents.JOINED, {token: user?._id, roomId});
  });

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

          <div className="absolute top-0 left-0 text-white p-8">
            <p className="text-6xl">Reversi</p>
            <p
              className="text-3xl"
              onClick={() => {
                emitEvent(ClientEvents.CreateRoom, {token: user?._id, gameType: 'NORMAL'});
                setAppState(AppState.IN_GAME);
              }}>
              Play
            </p>
            <p
              className="text-3xl"
              onClick={() => {
                emitEvent(ClientEvents.JOINED, {token: user?._id, roomId});
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
