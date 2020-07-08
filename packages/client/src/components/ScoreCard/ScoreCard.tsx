import * as React from 'react';
import {FaCircle} from 'react-icons/fa';
import {Cell, PlayerColor} from 'reversi-types';

interface ScoreCardProps {
  score: number;
  border: boolean;
  playerType: PlayerColor;
  className?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  playerType,
  border,
  className = '',
}) => {
  return (
    <div
      className={`text-${
        playerType === Cell.WHITE ? 'white' : 'black'
      } ${className} pt-4 ${
        border ? 'border-4 rounded-md border-purple-500 p-2' : ''
      }`}>
      <p className="text-xl">
        {playerType === Cell.BLACK ? 'Black' : 'White'} Player{' '}
        <FaCircle className="float-left m-2" />
      </p>
      <p className="text-6xl">{score}</p>
    </div>
  );
};

export default ScoreCard;
