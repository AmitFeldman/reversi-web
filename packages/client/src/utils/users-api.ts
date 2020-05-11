import client from './api-client';
import {User} from 'reversi-types';

export enum UserErrorCode {
  USER_NOT_FOUND = 1,
  USERNAME_EXIST = 2,
  EMAIL_EXIST = 3,
}

export type RegisterBody = Pick<User, 'username' | 'password' | 'email'>;

const register = async (registerData: RegisterBody): Promise<User> => {
  return await client<RegisterBody, User>('users/register', {
    body: registerData,
  });
};

export type LoginBody = Pick<User, 'username' | 'password'>;

const login = async (loginData: LoginBody): Promise<User> => {
  return await client<LoginBody, User>('users/login', {
    body: loginData,
  });
};

// Returns the user that is logged on by token
const getMe = async (): Promise<User> => {
  return await client<{}, User>('users/me');
};

export {register, login, getMe};
