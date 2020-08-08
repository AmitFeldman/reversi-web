import * as React from 'react';
import IconButton from '../IconButton/IconButton';
import {TiArrowBack} from 'react-icons/ti';
import {IoMdReverseCamera} from 'react-icons/io';
import {FiArrowDownCircle} from 'react-icons/fi';
import {FaHighlighter} from 'react-icons/fa';
import ScoreCard from '../ScoreCard/ScoreCard';
import {Cell} from 'reversi-types';
import {useCamera} from '../../context/CameraContext';
import {useOptions} from '../../context/OptionsContext';
import {useGameManager} from '../../context/GameManagerContext';

const InGameHud: React.FC = () => {
  const {resetCamera} = useCamera();
  const {setTopDown, setShowValidMoves} = useOptions();
  const {leaveGame, turn, getScore, getName} = useGameManager();

  return (
    <div>
      <div className="absolute top-0 left-0 z-20">
        <IconButton onClick={leaveGame} tooltipText="Leave Game">
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

        <IconButton
          onClick={() => setShowValidMoves((show) => !show)}
          tooltipText="Toggle Highlight Valid Moves">
          <FaHighlighter />
        </IconButton>
      </div>

      <ScoreCard
        className="absolute top-0 left-25"
        playerType={Cell.WHITE}
        border={turn === Cell.WHITE}
        score={getScore(Cell.WHITE)}
        displayName={getName(Cell.WHITE)}
      />

      <ScoreCard
        className="absolute top-0 right-25"
        playerType={Cell.BLACK}
        border={turn === Cell.BLACK}
        score={getScore(Cell.BLACK)}
        displayName={getName(Cell.BLACK)}
      />
    </div>
  );
};

export default InGameHud;
