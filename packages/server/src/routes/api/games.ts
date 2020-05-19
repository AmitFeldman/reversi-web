import {Router} from 'express';
import User from './users';
import * as mongoose from 'mongoose';
// import User from '../../models/User';
//
// const Errors = {
//   USER_NOT_FOUND: 1,
//   USERNAME_EXIST: 2,
//   EMAIL_EXIST: 3,
// };

const router = Router();

// POST api/games/createGame
router.post('/createGame', async (req, res) => {
  const gameName = "aaa";
  const {type, turn} = req.body;

  const {_id} = req.user;
  const userId = mongoose.Types.ObjectId(_id);

  const newGame =


  // if (!username || !password || !email)
  //   return res.status(400).send({error: {msg: 'Not all information sent'}});
  //
  // const existingUsername = await User.findOne({username});
  // if (existingUsername)
  //   return res.status(400).send({
  //     error: {code: Errors.USERNAME_EXIST, msg: 'Username already in use'},
  //   });
  //
  // const existingEmail = await User.findOne({email});
  // if (existingEmail)
  //   return res
  //     .status(400)
  //     .send({error: {code: Errors.EMAIL_EXIST, msg: 'Email already in use'}});
  //
  // const newUser = new User({
  //   username,
  //   password,
  //   email,
  //   isAdmin: false,
  // });
  //
  // newUser
  //   .save()
  //   .then(user => res.json(user))
  //   .catch(err => console.log(err.message));
});

// GET api/users/me
router.get('/createRoom', (req: any, res) => {
  // creates and return the id of the room
});

router.get('/joinRoom', (req: any, res) => {
  // insert user to room

});

export default router;
