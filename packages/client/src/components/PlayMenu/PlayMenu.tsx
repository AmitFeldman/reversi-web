import * as React from 'react';
import Button from '../Button/Button';
import Tabs from '../Tabs/Tabs';
import LabeledInput from '../LabeledInput/LabeledInput';
import {BsChevronDown} from 'react-icons/bs';
import {GameType} from 'reversi-types';

const GameDescription: React.FC<{description: string}> = ({description}) => {
  return (
    <div className="flex border-b mb-2">
      <p className="font-semibold mb-2 break-words">{description}</p>
    </div>
  );
};

interface DifficultyOption {
  value: GameType;
  label: string;
}

const difficultyOptions: DifficultyOption[] = [
  {value: 'AI_EASY', label: 'Easy'},
  {value: 'AI_MEDIUM', label: 'Medium'},
  {value: 'AI_HARD', label: 'Hard'},
];

interface PlayMenuProps {
  beginGame: (gameType: GameType) => void;
}

const PlayMenu: React.FC<PlayMenuProps> = ({beginGame}) => {
  const [difficulty, setDifficulty] = React.useState<GameType>('AI_EASY');
  const [roomId, setRoomId] = React.useState<string>('');

  return (
    <Tabs
      tabs={[
        {
          title: 'Local',
          content: (
            <>
              <GameDescription description="Play against a friend on the same computer!" />

              <Button onClick={() => beginGame('LOCAL')}>Start Game</Button>
            </>
          ),
        },
        {
          title: 'Online',
          content: (
            <>
              <GameDescription description="Play a competitive game using online matchmaking!" />

              <LabeledInput
                label="Room id"
                value={roomId}
                onValueChange={(e: React.FormEvent<HTMLInputElement>) => {
                  setRoomId(e.currentTarget.value);
                }}
              />
              <div className="flex justify-center">
                <Button
                  className="mr-6"
                  onClick={() => beginGame('PRIVATE_ROOM')}>
                  Create Room
                </Button>
                <Button onClick={() => beginGame('PRIVATE_ROOM')}>
                  Join Room
                </Button>
              </div>
            </>
          ),
        },
        {
          title: 'Bot',
          content: (
            <>
              <GameDescription
                description="Play a challenging game against an AI controlled bot and
                  select your preferred difficulty!"
              />

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
                  {difficultyOptions.map(({label, value}, index) => (
                    <option key={index} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <BsChevronDown />
                </div>
              </div>

              <Button onClick={() => beginGame(difficulty)}>Start Game</Button>
            </>
          ),
        },
      ]}
    />
  );
};

export default PlayMenu;
