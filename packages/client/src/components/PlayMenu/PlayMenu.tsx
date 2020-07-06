import * as React from 'react';
import Button from '../Button/Button';
import Tabs from '../Tabs/Tabs';
import LabeledInput from '../LabeledInput/LabeledInput';
import {BsChevronDown} from 'react-icons/bs';
import {GameType} from 'reversi-types';

interface PlayMenuProps {
  beginGame: (gameType: GameType) => void;
  roomId: string;
  setRoomId: (newRoomId: string) => void;
}

const PlayMenu: React.FC<PlayMenuProps> = ({beginGame, roomId, setRoomId}) => {
  // const [roomId, setRoomId] = React.useState<string>('');
  const [difficulty, setDifficulty] = React.useState<GameType>('AI_EASY');
  const [player1, setPlayer1] = React.useState<string>('');
  const [player2, setPlayer2] = React.useState<string>('');

  const difficultyOptions: {value: GameType; label: string}[] = [
    {value: 'AI_EASY', label: 'Easy'},
    {value: 'AI_MEDIUM', label: 'Medium'},
    {value: 'AI_HARD', label: 'Hard'},
  ];

  const tabsList = [
    {
      title: 'Local',
      content: (
        <>
          <LabeledInput
            label="Player 1"
            value={player1}
            onValueChange={(e: React.FormEvent<HTMLInputElement>) => {
              setPlayer1(e.currentTarget.value);
            }}
          />

          <LabeledInput
            label="Player 2"
            value={player2}
            onValueChange={(e: React.FormEvent<HTMLInputElement>) => {
              setPlayer2(e.currentTarget.value);
            }}
          />

          <Button onClick={() => beginGame('LOCAL')}>Start Game</Button>
        </>
      ),
    },
    {
      title: 'Online',
      content: (
        <>
          <LabeledInput
            label="Room id"
            value={roomId}
            onValueChange={(e: React.FormEvent<HTMLInputElement>) => {
              setRoomId(e.currentTarget.value);
            }}
          />
          <div className="flex justify-center">
            <Button className="mr-6" onClick={() => beginGame('PRIVATE_ROOM')}>
              Create Room
            </Button>
            <Button onClick={() => beginGame('PRIVATE_ROOM')}>Join Room</Button>
          </div>
        </>
      ),
    },
    {
      title: 'Bot',
      content: (
        <>
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Difficulty
          </label>
          <div className="relative mb-6">
            <select
              className="block appearance-none w-full bg-gray-200 border-2 border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="grid-state"
              value={difficulty}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setDifficulty(e.currentTarget.value as GameType);
              }}>
              {difficultyOptions.map(({value, label}, index) => {
                return (
                  <option key={index} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <BsChevronDown />
            </div>
          </div>

          <Button onClick={() => beginGame(difficulty)}>Start Game</Button>
        </>
      ),
    },
  ];

  return <Tabs tabsList={tabsList} />;
};

export default PlayMenu;
