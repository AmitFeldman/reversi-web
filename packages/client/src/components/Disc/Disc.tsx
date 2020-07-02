import * as React from 'react';
import {Vector3} from 'three';
import {PositionArray} from '../../constants/game-constants';
import {Cell, PlayerColor} from 'reversi-types';

const DISC_RADIUS = 0.4;
const DISC_HEIGHT = 0.05;
const RADIAL_SEGMENTS = 32;
const BLACK = 'black';
const WHITE = 'white';

interface DiskProps {
  position: PositionArray;
  type: PlayerColor;
}

const Disc: React.FC<DiskProps> = ({position, type}) => {
  const vector = new Vector3(...position);

  return (
    <group>
      <mesh position={[vector.x, vector.y + DISC_HEIGHT, vector.z]}>
        <cylinderBufferGeometry
          attach="geometry"
          args={[DISC_RADIUS, DISC_RADIUS, DISC_HEIGHT, RADIAL_SEGMENTS]}
        />
        <meshStandardMaterial
          attach="material"
          color={type === Cell.WHITE ? BLACK : WHITE}
        />
      </mesh>

      <mesh position={[vector.x, vector.y + DISC_HEIGHT * 2, vector.z]}>
        <cylinderBufferGeometry
          attach="geometry"
          args={[DISC_RADIUS, DISC_RADIUS, DISC_HEIGHT, RADIAL_SEGMENTS]}
        />
        <meshStandardMaterial
          attach="material"
          color={type === Cell.WHITE ? WHITE : BLACK}
        />
      </mesh>
    </group>
  );
};

export default Disc;
