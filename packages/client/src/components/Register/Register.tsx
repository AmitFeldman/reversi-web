import * as React from 'react';
import {useAuth} from '../../context/AuthContext';

const Register: React.FC = () => {
  const {register, isUserLoggedIn, logout} = useAuth();

  const [username, setUsername] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const registerUser = () => {
    register({username, email, password}).catch((err) => {
      console.log('ERROR: Register Failed', err);
    });
  };

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
      <h1>Register</h1>
      <hr />

      <h3>Username</h3>
      <input
        type="email"
        name="Username"
        value={username}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          setUsername(e.currentTarget.value);
        }}
      />

      <h3>Email</h3>
      <input
        type="text"
        name="Email"
        value={email}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          setEmail(e.currentTarget.value);
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
      <button onClick={registerUser}>Submit</button>
    </>
  );
};

export default Register;
