import * as React from 'react';
import IconButton from '../IconButton/IconButton';
import {AiOutlineLogin, AiOutlineLogout} from 'react-icons/ai';
import {MdCreate} from 'react-icons/md';
import {useAuth} from '../../context/AuthContext';
import Modal from 'react-modal';
import Login from '../Login/Login';
import Register from '../Register/Register';

type ModalContent = 'login' | 'register' | 'none';

const UserControls: React.FC = () => {
  const {isUserLoggedIn, logout} = useAuth();
  const [modalContent, setModalContent] = React.useState<ModalContent>('none');

  const closeModal = () => setModalContent('none');

  const loggedIn = isUserLoggedIn();

  return (
    <>
      {loggedIn ? (
        <IconButton onClick={logout} place="left">
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

      <Modal
        className="w-1/4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 float-right m-5"
        overlayClassName=""
        isOpen={modalContent !== 'none'}
        onRequestClose={closeModal}>
        {modalContent === 'login' ? (
          <Login onLogin={closeModal} />
        ) : (
          <Register onRegister={closeModal} />
        )}
      </Modal>
    </>
  );
};

export default UserControls;
