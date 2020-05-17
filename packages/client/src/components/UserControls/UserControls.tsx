import * as React from 'react';
import IconButton from '../IconButton/IconButton';
import {AiOutlineLogin, AiOutlineLogout} from 'react-icons/ai';
import {useAuth} from '../../context/AuthContext';

const DEFAULT_USERNAME = 'Guest';

const UserControls: React.FC = () => {
  const {user, isUserLoggedIn, logout, login} = useAuth();

  const loggedIn = isUserLoggedIn();

  return (
    <>
      <h3>Welcome, {loggedIn ? user?.username : DEFAULT_USERNAME}!</h3>

      {loggedIn ? (
        <IconButton onClick={logout}>
          <AiOutlineLogout />
        </IconButton>
      ) : (
        <IconButton
          onClick={() => {
            login({username: 'alon', password: '1111'});
          }}>
          <AiOutlineLogin />
        </IconButton>
      )}
    </>
  );
};

export default UserControls;
