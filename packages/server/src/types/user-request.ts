import {RequestHandler} from 'express';
import {MongoUser} from '../models/User';

export interface UserRequest extends RequestHandler {
  user: MongoUser | null;
  headers: {
    token?: string;
  }
}
