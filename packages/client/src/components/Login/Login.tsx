import * as React from 'react';
import {useAuth} from '../../context/AuthContext';
import LabeledInput from '../LabeledInput/LabeledInput';
import Button from '../Button/Button';
import ErrorMsg from '../ErrorMsg/ErrorMsg';

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({onLogin = () => {}}) => {
  const {login} = useAuth();

  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const loginUser = () => {
    if (!username) {
      setError('Username is required');
    } else if (!password) {
      setError('Password is required');
    } else {
      login({username, password})
        .then(() => {
          onLogin();
        })
        .catch((err) => {
          setError(err.msg);
        });
    }
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

      <ErrorMsg error={error} />

      <Button className="mt-4" onClick={loginUser}>
        Submit
      </Button>
    </>
  );
};

export default Login;
