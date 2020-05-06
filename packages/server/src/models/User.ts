import {Schema, model, Document} from 'mongoose';
import {BasicType} from '../types/basic-type';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export interface User extends BasicType {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
}

export interface MongoUser extends User, Document {};

const User = model<MongoUser>('users', UserSchema);

export default User;
