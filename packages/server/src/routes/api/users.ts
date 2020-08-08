import {Router} from 'express';
import User from '../../models/User';
import {Errors, GameType, IGame, UserComputedStats} from 'reversi-types';
import {isUserConnected} from '../../services/socket-manager';

const router = Router();

// GET api/users/me
router.get('/me', (req: any, res) => {
  const {user} = req;

  if (!user) {
    return res.status(404).send({error: {msg: 'User not found'}});
  }

  res.json(user);
});

// POST api/users/register
router.post('/register', async (req, res) => {
  const {username, email, password} = req.body;

  if (!username || !password || !email)
    return res.status(400).send({error: {msg: 'Not all information sent'}});

  const existingUsername = await User.findOne({username});
  if (existingUsername)
    return res.status(400).send({
      error: {code: Errors.USERNAME_EXIST, msg: 'Username already in use'},
    });

  const existingEmail = await User.findOne({email});
  if (existingEmail)
    return res
      .status(400)
      .send({error: {code: Errors.EMAIL_EXIST, msg: 'Email already in use'}});

  const newUser = new User({
    username,
    password,
    email,
    isAdmin: false,
  });

  newUser
    .save()
    .then((user) => res.json(user))
    .catch((err) => console.log(err.message));
});

// POST api/users/login
router.post('/login', (req, res) => {
  const {username, password} = req.body;

  if (!username || !password)
    return res.status(400).send({error: {msg: 'Not all information sent'}});

  User.findOne({username, password}).then((user) => {
    if (!user) {
      return res
        .status(404)
        .send({error: {code: Errors.USER_NOT_FOUND, msg: 'User not found'}});
    }

    // if (isUserConnected(user.id)) {
    //   return res.status(404).send({
    //     error: {
    //       code: Errors.ALREADY_CONNECTED,
    //       msg: 'User already connected',
    //     },
    //   });
    // }

    res.json(user);
  });
});

const filterByGameType = (games: IGame[], gameType: GameType) =>
  games.filter(({type}) => type === gameType);

// GET api/users/leaderboards
router.get('/leaderboards/:type', async (req: any, res) => {
  const gameType: GameType = req.params.type;

  if (!gameType) {
    throw new Error('Leaderboards ERROR: No valid game type...');
  }

  const users = await User.find({}, {username: 1, stats: 1})
    .populate('stats.wins')
    .populate('stats.losses')
    .populate('stats.ties');

  const results: UserComputedStats[] = users
    .map(({_id, stats, username}) => {
      const wins = filterByGameType(
        (stats.wins as unknown) as IGame[],
        gameType
      ).length;
      const losses = filterByGameType(
        (stats.losses as unknown) as IGame[],
        gameType
      ).length;
      const ties = filterByGameType(
        (stats.ties as unknown) as IGame[],
        gameType
      ).length;

      return {
        userId: _id,
        username,
        wins,
        losses,
        ties,
        winLossRatio: (losses === 0 ? wins : wins / losses).toFixed(2),
      };
    })
    .filter(({wins, losses, ties}) => wins !== 0 || losses !== 0 || ties !== 0)
    .sort(({winLossRatio: a}, {winLossRatio: b}) => Number(b) - Number(a));

  res.json(results);
});

export default router;
