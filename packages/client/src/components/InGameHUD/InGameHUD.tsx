import * as React from 'react';
import IconButton from '../IconButton/IconButton';
import {TiArrowBack} from 'react-icons/ti';
import {IoMdReverseCamera} from 'react-icons/io';
import ScoreCard from '../ScoreCard/ScoreCard';
import {Cell, PlayerColor} from 'reversi-types';

interface InGameHUDProps {
  turn: PlayerColor | undefined;
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
        playerType={Cell.WHITE}
        border={turn === Cell.WHITE}
        score={scoreWhite}
      />

      <ScoreCard
        className="absolute top-0 right-25"
        playerType={Cell.BLACK}
        border={turn === Cell.BLACK}
        score={scoreBlack}
      />
    </div>
  );
};

export default InGameHud;
