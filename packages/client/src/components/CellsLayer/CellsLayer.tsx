import * as React from 'react';
import Cell from '../Cell/Cell';
import {Cell as CellType, Move} from 'reversi-types';
import {Vector3} from 'three';
import {
  BOARD_HEIGHT,
  BOARD_POSITION,
  BOARD_SIZE,
  CELL_SIZE,
} from '../../constants/game-constants';
import {mapOverBoard} from '../../utils/board-helper';

interface CellLayerProps {
  cells: CellType[];
  validMoves: Move[];
  showValidMoves: boolean;
  onCellClick?: (row: number, column: number) => void;
  disabled?: boolean;
}

const CellLayer: React.FC<CellLayerProps> = ({
  cells,
  validMoves,
  showValidMoves = false,
  onCellClick = () => {},
  disabled = false,
}) => {
  const vector = new Vector3(...BOARD_POSITION);

  return (
    <group>
      {mapOverBoard(cells, (cell, row, column, index) => (
        <Cell
          id={index}
          key={index}
          onClick={() => onCellClick(row, column)}
          highlight={showValidMoves}
          clickable={
            !disabled &&
            validMoves.some(
              ({row: vr, column: vc}) => row === vr && column === vc
            )
          }
          position={[
            vector.x + column - 1 - BOARD_SIZE / 2 + CELL_SIZE / 2,
            vector.y,
            vector.z + row - 1 - BOARD_SIZE / 2 + CELL_SIZE / 2,
          ]}
          cellHeight={BOARD_HEIGHT}
          cellSize={CELL_SIZE}
        />
      ))}
    </group>
  );
};

export default CellLayer;
