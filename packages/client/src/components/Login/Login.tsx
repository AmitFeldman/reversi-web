import * as React from 'react';
import {useAuth} from '../../context/AuthContext';
import {emitEvent, onSocketEvent} from '../../utils/socket-client';
import {number} from 'prop-types';

const Login: React.FC = () => {
  const {login, isUserLoggedIn, logout} = useAuth();

  // setInterval(() => {
  //   emitEvent("maaaa", "heyyyy");
  //   emitEvent('joinRoom', 'asdasd');
  // }, 1000);

  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const loginUser = () => {
    login({username, password}).catch((err) => {
      console.log('ERROR: Login Failed, err');
    });
  };

  let count = 0;

  const playerMove = () => {
    emitEvent("playerMove", JSON.stringify({location: count, value: 1}));
    count++;
  };

  onSocketEvent('playerMove', (board: number[]) => {
    console.log('zain tov');
  });

  if (isUserLoggedIn()) {
    return (
      <>
        <h1>User is already logged in!</h1>
        <button onClick={logout}>Logout</button>
      </>
    );
  }

  return (
    <>
      <h1>Login</h1>
      <hr />

      <h3>Username</h3>
      <input
        type="text"
        name="Username"
        value={username}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          setUsername(e.currentTarget.value);
        }}
      />

      <h3>Password</h3>
      <input
        type="text"
        name="Password"
        value={password}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          setPassword(e.currentTarget.value);
        }}
      />

      <br />
      <br />
      <button onClick={loginUser}>Submit</button>
      <button onClick={playerMove}>Player 1 move</button>
    </>
  );
};

export default Login;
