import * as React from 'react';
import {useAuth} from '../../context/AuthContext';
import LabeledInput from '../LabeledInput/LabeledInput';
import Button from '../Button/Button';

interface RegisterProps {
  onRegister?: () => void;
}

const Register: React.FC<RegisterProps> = ({onRegister = () => {}}) => {
  const {register} = useAuth();

  const [username, setUsername] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const registerUser = () => {
    register({username, email, password})
      .then(() => {
        onRegister();
      })
      .catch((err) => {
        console.log('ERROR: Register Failed', err);
      });
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

      <Button onClick={registerUser}>Submit</Button>
    </>
  );
};

export default Register;
