import * as React from 'react';
import UserControls from '../UserControls/UserControls';
import {useAuth} from '../../context/AuthContext';
import InGameHud from '../InGameHUD/InGameHUD';
import PlayMenu from '../PlayMenu/PlayMenu';
import MenuButton from '../MenuButton/MenuButton';
import {useGameManager} from '../../context/GameManagerContext';
import HUDModal from '../HUDModal/HUDModal';
import LeaderboardMenu from '../LeaderboardMenu/LeaderboardMenu';
import {User} from 'reversi-types';

const DEFAULT_USERNAME = 'Guest';

type modalType = 'none' | 'CUSTOM_GAME' | 'LEADERBOARD';

const HeadsUpDisplay: React.FC = () => {
  const {user, isUserLoggedIn} = useAuth();
  const {inGame, startGame} = useGameManager();
  const [modal, setModal] = React.useState<modalType>('none');

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
            <p className="text-6xl mb-2 cursor-default">Reversi</p>
            <MenuButton
              text="Quick Play"
              enabled={isUserLoggedIn()}
              disabledTooltipText="Login to Quick Play!"
              onClick={() => {
                startGame('PUBLIC_ROOM');
              }}
            />
            <MenuButton
              enabled={isUserLoggedIn()}
              disabledTooltipText="Login to play a Custom Game!"
              text="Custom Game"
              onClick={() => setModal('CUSTOM_GAME')}
            />
            <MenuButton
              text="Leaderboards"
              onClick={() => setModal('LEADERBOARD')}
            />
          </div>
        </>
      )}

      <HUDModal
        className={`top-0 float-left ${modal === 'CUSTOM_GAME' && 'max-w-sm'}`}
        onRequestClose={() => setModal('none')}
        isOpen={modal !== 'none'}>
        <p className="text-6xl text-black mb-4 cursor-default">Reversi</p>
        {modal === 'CUSTOM_GAME' ? (
          <PlayMenu closeMenu={() => setModal('none')} />
        ) : modal === 'LEADERBOARD' ? (
          <LeaderboardMenu user={user as User} />
        ) : (
          <></>
        )}
      </HUDModal>
    </>
  );
};

export default HeadsUpDisplay;
