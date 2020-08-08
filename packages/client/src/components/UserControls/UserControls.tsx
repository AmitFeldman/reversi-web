import * as React from 'react';
import IconButton from '../IconButton/IconButton';
import {AiOutlineLogin, AiOutlineLogout} from 'react-icons/ai';
import {MdCreate} from 'react-icons/md';
import {useAuth} from '../../context/AuthContext';
import Login from '../Login/Login';
import Register from '../Register/Register';
import HUDModal from '../HUDModal/HUDModal';

type ModalContent = 'login' | 'register' | 'none';

const UserControls: React.FC = () => {
  const {isUserLoggedIn, logout} = useAuth();
  const [modalContent, setModalContent] = React.useState<ModalContent>('none');

  const closeModal = () => setModalContent('none');

  const loggedIn = isUserLoggedIn();

  return (
    <>
      {loggedIn ? (
        <IconButton onClick={logout} tooltipText="Logout" place="left">
          <AiOutlineLogout />
        </IconButton>
      ) : (
        <>
          <IconButton
            tooltipText="Login"
            place="left"
            onClick={() => {
              setModalContent('login');
            }}>
            <AiOutlineLogin />
          </IconButton>
          <IconButton
            tooltipText="Register"
            place="left"
            onClick={() => {
              setModalContent('register');
            }}>
            <MdCreate />
          </IconButton>
        </>
      )}

      <HUDModal
        className="float-right"
        isOpen={modalContent !== 'none'}
        onRequestClose={closeModal}>
        {modalContent === 'login' ? (
          <Login onLogin={closeModal} />
        ) : (
          <Register onRegister={closeModal} />
        )}
      </HUDModal>
    </>
  );
};

export default UserControls;
