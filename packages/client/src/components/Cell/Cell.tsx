import * as React from 'react';
import {PositionArray} from '../../constants/game-constants';

export enum CellState {
  BLACK,
  WHITE,
  EMPTY,
}

interface CellProps {
  id: number;
  position: PositionArray;
  cellSize: number;
  cellHeight: number;
  onClick: (id: number) => void;
  clickable?: boolean;
}

const Cell: React.FC<CellProps> = ({
  id,
  position,
  cellSize,
  cellHeight,
  onClick,
  clickable = true,
}) => {
  const [hovered, setHover] = React.useState(false);

  return (
    <mesh
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
        clickable && onClick(id);
        e.stopPropagation();
      }}>
      <boxBufferGeometry
        attach="geometry"
        args={[cellSize, cellHeight, cellSize]}
      />
      <meshStandardMaterial
        attach="material"
        color={clickable && hovered ? 0x00ff00 : 0x008000}
      />
    </mesh>
  );
};

export default Cell;
