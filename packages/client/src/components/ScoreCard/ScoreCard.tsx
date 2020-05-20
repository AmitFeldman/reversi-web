import * as React from 'react';
import {CellState} from '../Cell/Cell';
import {FaCircle} from 'react-icons/fa';
import {DiscType} from '../Disc/Disc';

interface ScoreCardProps {
  score: number;
  border: boolean;
  playerType: DiscType;
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
        playerType === CellState.WHITE ? 'white' : 'black'
      } ${className} pt-4 ${
        border ? 'border-4 rounded-md border-purple-500 p-2' : ''
      }`}>
      <p className="text-xl">
        White Player <FaCircle className="float-left m-2" />
      </p>
      <p className="text-6xl">{score}</p>
    </div>
  );
};

export default ScoreCard;
