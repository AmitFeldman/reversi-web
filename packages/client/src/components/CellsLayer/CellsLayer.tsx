import * as React from 'react';
import Cell, {CellState} from '../Cell/Cell';
import {Vector3} from 'three';
import {
  BOARD_HEIGHT,
  BOARD_POSITION,
  BOARD_SIZE,
  CELL_SIZE,
} from '../../constants/game-constants';

interface CellLayerProps {
  cells: CellState[];
  onCellClick?: (index: number) => void;
}

const CellLayer: React.FC<CellLayerProps> = ({
  cells,
  onCellClick = () => {},
}) => {
  const vector = new Vector3(...BOARD_POSITION);

  return (
    <group>
      {cells.map((cell, index) => (
        <Cell
          id={index}
          key={index}
          onClick={() => onCellClick(index)}
          clickable={cell === CellState.EMPTY}
          position={[
            vector.x + (index % 8) - BOARD_SIZE / 2 + CELL_SIZE / 2,
            vector.y,
            vector.z + Math.floor(index / 8) - BOARD_SIZE / 2 + CELL_SIZE / 2,
          ]}
          cellHeight={BOARD_HEIGHT}
          cellSize={CELL_SIZE}
        />
      ))}
    </group>
  );
};

export default CellLayer;
