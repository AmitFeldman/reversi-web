import wordsData from './../data/words';

const getRandomItem = (array: string[]): string =>
  array[Math.floor(Math.random() * array.length)];

const getRandomWord = (): string => {
  const index = Math.round(Math.random());
  return (
    getRandomItem(wordsData[index]) + getRandomItem(wordsData[(index + 1) % 2])
  );
};

export {getRandomWord};
