import GameModel from '../models/Game';

const getAllGames = () => {
  return GameModel.find();
};


