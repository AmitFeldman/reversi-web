import * as React from 'react';
import Button from '../Button/Button';

interface MenuProps {
  beginGame: () => void;
}

const Menu: React.FC<MenuProps> = ({beginGame}) => {
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  const tabContent = [<>Tab 1</>, <>Tab 2</>, <>Tab 3</>];

  const getTabClass = (index: number): string => {
    if (index === tabIndex) {
      return 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-purple-600 font-semibold';
    } else {
      return 'bg-white inline-block py-2 px-4 text-purple-400 hover:text-purple-500 font-semibold';
    }
  };

  return (
    <>
      <p className="text-6xl text-black mb-4">Reversi</p>

      <ul className="flex border-b mb-4">
        <li className="-mb-px mr-4 ml-4 cursor-pointer">
          <p className={getTabClass(0)} onClick={() => setTabIndex(0)}>
            Local
          </p>
        </li>
        <li className="-mb-px mr-4 ml-4 cursor-pointer">
          <p className={getTabClass(1)} onClick={() => setTabIndex(1)}>
            Online
          </p>
        </li>
        <li className="-mb-px mr-4 ml-4 cursor-pointer">
          <p className={getTabClass(2)} onClick={() => setTabIndex(2)}>
            Bot
          </p>
        </li>
      </ul>

      {tabContent[tabIndex]}

      <Button onClick={beginGame}>Start Game</Button>
    </>
  );
};

export default Menu;
