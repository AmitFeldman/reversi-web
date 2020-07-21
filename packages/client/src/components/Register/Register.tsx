import * as React from 'react';
import {useAuth} from '../../context/AuthContext';
import LabeledInput from '../LabeledInput/LabeledInput';
import Button from '../Button/Button';
import ErrorMsg from '../ErrorMsg/ErrorMsg';

interface RegisterProps {
  onRegister?: () => void;
}

const Register: React.FC<RegisterProps> = ({onRegister = () => {}}) => {
  const {register} = useAuth();
  const [username, setUsername] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const registerUser = () => {
    if (!username) {
      setError('Username is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email not valid');
    } else if (!password) {
      setError('Password is required');
    } else {
      register({username, email, password})
        .then(() => {
          onRegister();
        })
        .catch((err) => {
          setError(err.msg);
        });
    }
  };

  return (
    <>
      <p className="text-4xl text-center text-black mb-4">Register</p>
      <LabeledInput
        label="Username"
        value={username}
        onValueChange={(e: React.FormEvent<HTMLInputElement>) => {
          setUsername(e.currentTarget.value);
        }}
      />

      <LabeledInput
        label="Email"
        value={email}
        onValueChange={(e: React.FormEvent<HTMLInputElement>) => {
          setEmail(e.currentTarget.value);
        }}
      />

      <LabeledInput
        label="Password"
        value={password}
        onValueChange={(e: React.FormEvent<HTMLInputElement>) => {
          setPassword(e.currentTarget.value);
        }}
      />

      <ErrorMsg error={error} />

      <Button className="mt-4" onClick={registerUser}>
        Submit
      </Button>
    </>
  );
};

export default Register;
