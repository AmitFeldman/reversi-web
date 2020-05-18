import * as React from 'react';
import {Vector3} from 'three';

const DISC_RADIUS = 0.4;
const DISC_HEIGHT = 0.05;
const RADIAL_SEGMENTS = 32;
const BLACK = 'black';
const WHITE = 'white';

export type DiscType = 'black' | 'white';

interface DiskProps {
  position: Vector3;
  type: DiscType;
}

const Disc: React.FC<DiskProps> = ({position, type}) => {
  return (
    <group>
      <mesh
        position={
          new Vector3(position.x, position.y + DISC_HEIGHT, position.z)
        }>
        <cylinderBufferGeometry
          attach="geometry"
          args={[DISC_RADIUS, DISC_RADIUS, DISC_HEIGHT, RADIAL_SEGMENTS]}
        />
        <meshStandardMaterial
          attach="material"
          color={type === 'white' ? BLACK : WHITE}
        />
      </mesh>
      <mesh
        position={
          new Vector3(position.x, position.y + DISC_HEIGHT * 2, position.z)
        }>
        <cylinderBufferGeometry
          attach="geometry"
          args={[DISC_RADIUS, DISC_RADIUS, DISC_HEIGHT, RADIAL_SEGMENTS]}
        />
        <meshStandardMaterial
          attach="material"
          color={type === 'white' ? WHITE : BLACK}
        />
      </mesh>
    </group>
  );
};

export default Disc;
