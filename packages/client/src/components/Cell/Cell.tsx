import * as React from 'react';
import {Mesh, Vector3} from 'three';

interface CellProps {
  id: number;
  position: Vector3;
  cellSize: number;
  cellHeight: number;
  onClick: (id: number) => void;
}

const Cell: React.FC<CellProps> = ({
  id,
  position,
  cellSize,
  cellHeight,
  onClick,
}) => {
  const mesh = React.useRef<Mesh>();

  const [hovered, setHover] = React.useState(false);

  return (
    <mesh
      ref={mesh}
      position={position}
      onPointerOver={(e) => {
        setHover(true);
        e.stopPropagation();
      }}
      onPointerOut={(e) => {
        setHover(false);
        e.stopPropagation();
      }}
      onClick={(e) => {
        onClick(id);
        e.stopPropagation();
      }}>
      <boxBufferGeometry
        attach="geometry"
        args={[cellSize, cellHeight, cellSize]}
      />
      <meshStandardMaterial
        attach="material"
        color={hovered ? 0x00ff00 : 0x008000}
      />
    </mesh>
  );
};

export default Cell;
