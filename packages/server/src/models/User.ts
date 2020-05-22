import {Schema, model, Model} from 'mongoose';
import {BaseDocument} from '../types/base-document';

export interface User extends BaseDocument {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
}

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
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
    immutable: true,
  },
});

const User = model<User, Model<User>>('users', UserSchema);

export default User;
