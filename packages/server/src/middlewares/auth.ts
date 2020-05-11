import User from '../models/User';
import {isIdValid} from '../utils/validation';
import {Request, Response, NextFunction} from 'express';

// Take token from request and parse it to the user who sent the request
// This middleware is applied to all requests
const parseToken = (req: Request, res: Response, next: NextFunction) => {
  const id = req.headers.token;

  if (isIdValid(id)) {
    User.findById(id)
      .then((user) => {
        req.user = user;
      })
      .finally(() => {
        next();
      });
  } else {
    next();
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const {user} = req;
  const isUserAdmin = user && user.isAdmin;

  if (!isUserAdmin) {
    return res.status(401).send({error: {msg: 'User is not an admin'}});
  }

  next();
};

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const {user} = req;
  if (!user) {
    return res.status(401).send({error: {msg: 'User is not logged in'}});
  }

  next();
};

export {parseToken, isAdmin, isLoggedIn};
