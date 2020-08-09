import wordsData from './../data/words';
import GameModel from '../models/Game';
import {GameStatus} from 'reversi-types';

const getRandomItem = (array: string[]): string =>
  array[Math.floor(Math.random() * array.length)];

const getRandomWord = (): string => {
  const index = Math.round(Math.random());
  return (
    getRandomItem(wordsData[index]) + getRandomItem(wordsData[(index + 1) % 2])
  );
};

const getSafeRoomCode = async (): Promise<string> => {
  const roomCode = getRandomWord();

  const game = (
    await GameModel.find({roomCode, status: GameStatus.WAITING})
  )[0];

  if (game) {
    return await getSafeRoomCode();
  } else {
    return roomCode;
  }
};

export {getSafeRoomCode};
