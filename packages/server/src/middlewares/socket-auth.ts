import {isIdValid} from '../utils/validation';
import User from '../models/User';
import {Middleware} from '../utils/socket-service';
import {BaseArgs} from 'reversi-types';

const parseToken: Middleware<BaseArgs> = (data, next) => {
  const {token: id} = data;

  if (isIdValid(id)) {
    User.findById(id)
      .then((user) => {
        if (user) {
          data.user = user;
        }
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        next();
      });
  } else {
    next();
  }
};

const isLoggedIn: Middleware<BaseArgs> = ({user}, next) => {
  if (user) {
    next();
  }
};

export {parseToken, isLoggedIn}
