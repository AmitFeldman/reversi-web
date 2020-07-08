import * as React from 'react';
import UserControls from '../UserControls/UserControls';
import {useAuth} from '../../context/AuthContext';
import InGameHud from '../InGameHUD/InGameHUD';
import Modal from 'react-modal';
import PlayMenu from '../PlayMenu/PlayMenu';
import {GameType} from 'reversi-types';
import {useGameManager} from '../../context/GameManagerContext';

const DEFAULT_USERNAME = 'Guest';

const HeadsUpDisplay: React.FC = () => {
  const {user, isUserLoggedIn} = useAuth();
  const {inGame, startGame} = useGameManager();
  const [showMenu, setShowMenu] = React.useState<boolean>(false);

  const beginGame = (gameType: GameType) => {
    startGame(gameType);
    setShowMenu(false);
  };

  return (
    <>
      <div className="absolute right-0 top-0 p-2">
        <p className="text-white">
          {!isUserLoggedIn() ? 'Login or Register to Play' : 'Good luck'},{' '}
          {isUserLoggedIn() ? user?.username : DEFAULT_USERNAME}!
        </p>
      </div>

      {inGame && <InGameHud />}

      {!inGame && (
        <>
          <div className="absolute right-0 top-0 pt-8">
            <UserControls />
          </div>

          <div className="absolute top-0 left-0 text-white p-8 pl-12">
            <p className="text-6xl">Reversi</p>
            <p
              className="text-3xl cursor-pointer hover:text-black"
              onClick={() => setShowMenu(true)}>
              Play
            </p>
          </div>
        </>
      )}

      <Modal
        className="absolute top-0 bg-white shadow-md rounded px-8 pb-8 pt-3 float-left m-5 outline-none"
        overlayClassName=""
        isOpen={showMenu}
        onRequestClose={() => setShowMenu(false)}>
        <p className="text-6xl text-black mb-4">Reversi</p>
        <PlayMenu beginGame={beginGame} />
      </Modal>
    </>
  );
};

export default HeadsUpDisplay;
