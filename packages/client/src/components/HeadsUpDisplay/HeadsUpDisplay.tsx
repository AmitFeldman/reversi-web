import * as React from 'react';
import UserControls from '../UserControls/UserControls';
import {useAuth} from '../../context/AuthContext';
import {AppState, useAppData} from '../../context/AppContext';
import InGameHud from '../InGameHUD/InGameHUD';
import {createRoom} from '../../utils/socket/game-api';
import Modal from 'react-modal';
import PlayMenu from '../PlayMenu/PlayMenu';
import MenuButton from '../MenuButton/MenuButton';
import {PlayerColor, GameType} from 'reversi-types';
import {GrClose} from 'react-icons/gr';

const DEFAULT_USERNAME = 'Guest';

interface HeadsUpDisplayProps {
  scoreBlack: number;
  scoreWhite: number;
  turn: PlayerColor | undefined;
  roomId: string;
  setRoomId: (newRoomId: string) => void;
}

const HeadsUpDisplay: React.FC<HeadsUpDisplayProps> = ({
  scoreBlack,
  scoreWhite,
  turn,
  roomId,
  setRoomId,
}) => {
  const {user, isUserLoggedIn} = useAuth();
  const {appState, setAppState} = useAppData();
  const [showModal, setShowModal] = React.useState<boolean>(false);

  const beginGame = (gameType: GameType) => {
    switch (gameType) {
      case 'PRIVATE_ROOM':
        break;

      case 'AI_EASY':
      case 'AI_MEDIUM':
      case 'AI_HARD':
        createRoom({
          token: user?._id,
          gameType: gameType,
        });
        break;

      case 'LOCAL':
        break;
    }

    setAppState(AppState.IN_GAME);
    setShowModal(false);
  };

  return (
    <>
      <div className="absolute right-0 top-0 p-2">
        <p className="text-white">
          {!isUserLoggedIn() ? 'Login or Register to Play' : 'Good luck'},{' '}
          {isUserLoggedIn() ? user?.username : DEFAULT_USERNAME}!
        </p>
      </div>

      {appState === AppState.IN_GAME && (
        <InGameHud
          turn={turn}
          scoreWhite={scoreWhite}
          scoreBlack={scoreBlack}
          onLeaveGame={() => setAppState(AppState.MAIN_MENU)}
        />
      )}

      {appState === AppState.MAIN_MENU && (
        <>
          <div className="absolute right-0 top-0 pt-8">
            <UserControls />
          </div>

          <div className="absolute top-0 left-0 text-white p-8 pl-12">
            <p className="text-6xl mb-2">Reversi</p>
            <MenuButton text="Play" onClick={() => setShowModal(true)} />
            <MenuButton text="LeaderBoard" />
          </div>
        </>
      )}

      <Modal
        className="absolute top-0 bg-white shadow-md rounded px-8 pb-8 pt-3 float-left m-5 outline-none"
        overlayClassName=""
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}>
        <GrClose className="float-right -mr-5" />
        <p className="text-6xl text-black mb-4">Reversi</p>
        <PlayMenu beginGame={beginGame} roomId={roomId} setRoomId={setRoomId} />
      </Modal>
    </>
  );
};

export default HeadsUpDisplay;
