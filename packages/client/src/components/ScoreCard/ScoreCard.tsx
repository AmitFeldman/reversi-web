import * as React from 'react';
import {FaCircle} from 'react-icons/fa';
import {Cell, PlayerColor} from 'reversi-types';

interface ScoreCardProps {
  score: number;
  border: boolean;
  playerType: PlayerColor;
  displayName?: string;
  className?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  playerType,
  border,
  displayName = 'Guest',
  className = '',
}) => {
  const color = playerType === Cell.WHITE ? 'white' : 'black';

  return (
    <div
      className={`text-${color} ${className} pt-4 ${
        border ? 'border-4 rounded-md border-purple-500 p-2' : ''
      }`}>
      <p className="text-xl">
        {displayName}
        <FaCircle className="float-left m-2" />
      </p>
      <p className="text-6xl">{score}</p>
    </div>
  );
};

export default ScoreCard;
