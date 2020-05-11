import {MongoUser} from './models/User';

// Extend express Request interface
declare module 'express-serve-static-core' {
  interface Request {
    user?: MongoUser | null;
  }
}
