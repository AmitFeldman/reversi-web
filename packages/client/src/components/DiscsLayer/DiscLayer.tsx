import * as React from 'react';
import Disc from '../Disc/Disc';
import {BOARD_SIZE, CENTER_POSITION} from '../../constants/game-constants';
import {Vector3} from 'three';
import {Cell} from 'reversi-types';

interface DiscLayerProps {
  cells: Cell[];
}

const DiscLayer: React.FC<DiscLayerProps> = ({cells}) => {
  const vector = new Vector3(...CENTER_POSITION);

  return (
    <group>
      {cells.map(
        (cellState, index) =>
          cellState !== Cell.EMPTY && (
            <Disc
              key={index}
              type={cellState}
              position={[
                vector.x + (index % 8) - BOARD_SIZE / 2 + 0.5,
                vector.y,
                vector.z + Math.floor(index / 8) - BOARD_SIZE / 2 + 0.5,
              ]}
            />
          )
      )}
    </group>
  );
};

export default DiscLayer;
