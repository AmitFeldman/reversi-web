import {Router} from 'express';
import * as mongoose from 'mongoose';
import Game from '../../models/Game';
import {GameType} from 'reversi-types';
//
// const Errors = {
//   USER_NOT_FOUND: 1,
//   USERNAME_EXIST: 2,
//   EMAIL_EXIST: 3,
// };

const router = Router();

// POST api/games/create
router.post('/create', async (req, res) => {
  // const name = "aaa";
  // const {type} = req.body;

  const type: GameType = "AI_EASY";

  // const {_id} = req.user;
  // const userId = mongoose.Types.ObjectId(_id);

  const newGame = new Game({
    type
  });

  newGame.save().then((game) => {
    res.json(game._id);
  }).catch(err => {
    console.log(err.message)
  })
});

// // GET api/users/me
// router.get('/createRoom', (req: any, res) => {
//   // creates and return the id of the room
// });

router.get('/joinRoom', (req: any, res) => {
  // insert user to room

});

export default router;
