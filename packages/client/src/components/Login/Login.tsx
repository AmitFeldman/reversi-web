import * as React from 'react';
import {useAuth} from '../../context/AuthContext';

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({onLogin = () => {}}) => {
  const {login} = useAuth();

  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const loginUser = () => {
    login({username, password})
      .then(() => {
        onLogin();
      })
      .catch((err) => {
        console.log('ERROR: Login Failed, err');
      });
  };

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
    </>
  );
};

export default Login;
