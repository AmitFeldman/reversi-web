import * as React from 'react';
import UserControls from '../UserControls/UserControls';
import {useAuth} from '../../context/AuthContext';
import InGameHud from '../InGameHUD/InGameHUD';
import Modal from 'react-modal';
import PlayMenu from '../PlayMenu/PlayMenu';
import MenuButton from '../MenuButton/MenuButton';
import {GrClose} from 'react-icons/gr';
import {GameType} from 'reversi-types';
import {useGameManager} from '../../context/GameManagerContext';

const DEFAULT_USERNAME = 'Guest';

const HeadsUpDisplay: React.FC = () => {
  const {user, isUserLoggedIn} = useAuth();
  const {inGame, startGame} = useGameManager();
  const [showModal, setShowModal] = React.useState<boolean>(false);

  const beginGame = (gameType: GameType) => {
    startGame(gameType);
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

      {inGame ? (
        <InGameHud />
      ) : (
        <>
          <div className="absolute right-0 top-0 pt-8">
            <UserControls />
          </div>

          <div className="absolute top-0 left-0 text-white p-8 pl-12">
            <p className="text-6xl mb-2">Reversi</p>
            <MenuButton
              text="Play"
              onClick={() => {
                startGame('PUBLIC_ROOM');
              }}
            />
            <MenuButton text="Custom Game" onClick={() => setShowModal(true)} />
            <MenuButton text="Leaderboard" onClick={() => {}} />
          </div>
        </>
      )}

      <Modal
        className="absolute top-0 bg-white shadow-md rounded px-8 pb-8 pt-3 float-left m-5 outline-none max-w-sm"
        overlayClassName=""
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}>
        <GrClose
          className="float-right -mr-5 cursor-pointer"
          onClick={() => setShowModal(false)}
        />
        <p className="text-6xl text-black mb-4">Reversi</p>
        <PlayMenu beginGame={beginGame} />
      </Modal>
    </>
  );
};

export default HeadsUpDisplay;
