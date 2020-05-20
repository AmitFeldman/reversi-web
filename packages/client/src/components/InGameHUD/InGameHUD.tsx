import * as React from 'react';
import IconButton from '../IconButton/IconButton';
import {TiArrowBack} from 'react-icons/ti';
import {IoMdReverseCamera} from 'react-icons/io';
import ScoreCard from '../ScoreCard/ScoreCard';
import {CellState} from '../Cell/Cell';
import {DiscType} from '../Disc/Disc';

interface InGameHUDProps {
  turn: DiscType;
  scoreWhite: number;
  scoreBlack: number;
  onResetCameraClick: () => void;
  onLeaveGame: () => void;
}

const InGameHud: React.FC<InGameHUDProps> = ({
  onLeaveGame,
  onResetCameraClick,
  turn,
  scoreBlack,
  scoreWhite,
}) => {
  return (
    <div>
      <div className="absolute top-0 left-0">
        <IconButton onClick={onLeaveGame} tooltipText="Leave Game">
          <TiArrowBack />
        </IconButton>

        <IconButton onClick={onResetCameraClick} tooltipText="Reset Camera">
          <IoMdReverseCamera />
        </IconButton>
      </div>

      <ScoreCard
        className="absolute top-0 left-25"
        playerType={CellState.WHITE}
        border={turn === CellState.WHITE}
        score={scoreWhite}
      />

      <ScoreCard
        className="absolute top-0 right-25"
        playerType={CellState.BLACK}
        border={turn === CellState.BLACK}
        score={scoreBlack}
      />
    </div>
  );
};

export default InGameHud;
