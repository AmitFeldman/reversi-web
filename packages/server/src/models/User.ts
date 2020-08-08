import {Schema, model, Model} from 'mongoose';
import {User} from 'reversi-types';

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
  stats: {
    wins: {
      type: [{type: Schema.Types.ObjectId, ref: 'rooms'}],
      default: [],
    },
    losses: {
      type: [{type: Schema.Types.ObjectId, ref: 'rooms'}],
      default: [],
    },
    ties: {
      type: [{type: Schema.Types.ObjectId, ref: 'rooms'}],
      default: [],
    },
  },
  date: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

const UserModel = model<User, Model<User>>('users', UserSchema);

export default UserModel;
