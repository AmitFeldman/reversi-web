import * as React from 'react';
import {Vector3} from 'three';

const DISC_RADIUS = 0.4;
const DISC_HEIGHT = 0.05;
const RADIAL_SEGMENTS = 32;
const BLACK = 'black';
const WHITE = 'white';

interface DiskProps {
  position: Vector3;
}

// radiusTop, radiusBottom, height, radialSegments
const Disc: React.FC<DiskProps> = ({position}) => {
  return (
    <>
      <mesh
        position={
          new Vector3(position.x, position.y + DISC_HEIGHT, position.z)
        }>
        <cylinderBufferGeometry
          attach="geometry"
          args={[DISC_RADIUS, DISC_RADIUS, DISC_HEIGHT, RADIAL_SEGMENTS]}
        />
        <meshStandardMaterial attach="material" color={BLACK} />
      </mesh>
      <mesh
        position={
          new Vector3(position.x, position.y + DISC_HEIGHT * 2, position.z)
        }>
        <cylinderBufferGeometry
          attach="geometry"
          args={[DISC_RADIUS, DISC_RADIUS, DISC_HEIGHT, RADIAL_SEGMENTS]}
        />
        <meshStandardMaterial attach="material" color={WHITE} />
      </mesh>
    </>
  );
};

export default Disc;
