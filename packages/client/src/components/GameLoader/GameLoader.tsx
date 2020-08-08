import * as React from 'react';
import Loader from 'react-loader-spinner';
import {GameStatus} from 'reversi-types';
import {useGameManager} from '../../context/GameManagerContext';

const style = {textAlign: '-webkit-center'};

interface GameLoaderProps {}

const GameLoader: React.FC<GameLoaderProps> = () => {
  const {inGame, getStatus, isUserTurn, getEnemy, isLocal} = useGameManager();

  const getLoadingText = (): string => {
    const gameStatus = getStatus();

    if (gameStatus === GameStatus.WAITING) {
      return 'Waiting for another player...';
    }

    if (!gameStatus) {
      return '';
    }

    if (!isUserTurn()) {
      return `${getEnemy()?.displayName}'s turn...`;
    }

    return '';
  };

  const isVisible =
    inGame &&
    !isLocal() &&
    (getStatus() === GameStatus.WAITING || !isUserTurn());

  return (
    // @ts-ignore
    <div className="absolute z-10 w-full p-5" style={style}>
      <Loader visible={isVisible} type="ThreeDots" height={50} width={50} />
      {isVisible && <p className="text-white text-sm">{getLoadingText()}</p>}
    </div>
  );
};

export default GameLoader;
