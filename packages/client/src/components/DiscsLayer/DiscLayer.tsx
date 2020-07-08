import * as React from 'react';
import Disc from '../Disc/Disc';
import {BOARD_SIZE, CENTER_POSITION} from '../../constants/game-constants';
import {Vector3} from 'three';
import {Cell} from 'reversi-types';
import {mapOverBoard} from '../../utils/board-helper';

interface DiscLayerProps {
  cells: Cell[];
}

const DiscLayer: React.FC<DiscLayerProps> = ({cells}) => {
  const vector = new Vector3(...CENTER_POSITION);

  return (
    <group>
      {mapOverBoard(
        cells,
        (cell, row, column, index) =>
          cell !== Cell.EMPTY &&
          cell !== Cell.OUTER && (
            <Disc
              key={index}
              type={cell}
              position={[
                vector.x + column - 1 - BOARD_SIZE / 2 + 0.5,
                vector.y,
                vector.z + row - 1 - BOARD_SIZE / 2 + 0.5,
              ]}
            />
          )
      )}
    </group>
  );
};

export default DiscLayer;
