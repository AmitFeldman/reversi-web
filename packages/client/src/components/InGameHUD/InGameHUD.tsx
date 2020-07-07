import * as React from 'react';
import IconButton from '../IconButton/IconButton';
import {TiArrowBack} from 'react-icons/ti';
import {IoMdReverseCamera} from 'react-icons/io';
import {FiArrowDownCircle} from 'react-icons/fi';
import ScoreCard from '../ScoreCard/ScoreCard';
import {Cell, PlayerColor} from 'reversi-types';
import {useCamera} from '../../context/CameraContext';
import {useOptions} from '../../context/OptionsContext';

interface InGameHUDProps {
  turn: PlayerColor | undefined;
  scoreWhite: number;
  scoreBlack: number;
  onLeaveGame: () => void;
}

const InGameHud: React.FC<InGameHUDProps> = ({
  onLeaveGame,
  turn,
  scoreBlack,
  scoreWhite,
}) => {
  const {resetCamera} = useCamera();
  const {setTopDown} = useOptions();

  return (
    <div>
      <div className="absolute top-0 left-0">
        <IconButton onClick={onLeaveGame} tooltipText="Leave Game">
          <TiArrowBack />
        </IconButton>

        <IconButton onClick={resetCamera} tooltipText="Reset Camera">
          <IoMdReverseCamera />
        </IconButton>

        <IconButton
          onClick={() => setTopDown((td) => !td)}
          tooltipText="Toggle Top Down Camera">
          <FiArrowDownCircle />
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
