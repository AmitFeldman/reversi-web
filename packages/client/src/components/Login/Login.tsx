import * as React from 'react';
import {useAuth} from '../../context/AuthContext';
import LabeledInput from '../LabeledInput/LabeledInput';
import Button from '../Button/Button';

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({onLogin = () => {}}) => {
  const {login} = useAuth();

  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const loginUser = () => {
    login({username, password})
      .then(() => {
        onLogin();
      })
      .catch((err) => {
        console.log('ERROR: Login Failed, err');
        setError(err.msg);
      });
  };

  return (
    <>
      <p className="text-4xl text-center text-black mb-4">Login</p>
      <LabeledInput
        label="Username"
        value={username}
        onValueChange={(e: React.FormEvent<HTMLInputElement>) => {
          setUsername(e.currentTarget.value);
        }}
      />

      <LabeledInput
        label="Password"
        value={password}
        type="password"
        onValueChange={(e: React.FormEvent<HTMLInputElement>) => {
          setPassword(e.currentTarget.value);
        }}
      />

      <p className="text-red-500 text-xs italic">Please choose a password.</p>

      <Button onClick={loginUser}>Submit</Button>
    </>
  );
};

export default Login;
