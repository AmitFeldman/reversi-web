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
        onValueChange={(e: React.FormEvent<HTMLInputElement>) => {
          setPassword(e.currentTarget.value);
        }}
      />

      <Button onClick={loginUser}>Login</Button>
    </>
  );
};

export default Login;
