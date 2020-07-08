import * as React from 'react';
import {PositionArray} from '../../constants/game-constants';

// const CELL_COLOR = 0x2e8b57;
const CELL_COLOR = 0x267347;
const CELL_HOVER_COLOR = 0x37A150;
const CELL_HIGHLIGHT_COLOR = 0x37a164;

interface CellProps {
  id: number;
  position: PositionArray;
  cellSize: number;
  cellHeight: number;
  onClick: (id: number) => void;
  clickable?: boolean;
  highlight?: boolean;
}

const Cell: React.FC<CellProps> = ({
  id,
  position,
  cellSize,
  cellHeight,
  onClick,
  clickable = true,
  highlight = false,
}) => {
  const [hovered, setHover] = React.useState(false);

  const getColor = () => {
    if (clickable) {
      if (hovered) {
        return CELL_HOVER_COLOR;
      }

      if (highlight) {
        return CELL_HIGHLIGHT_COLOR;
      }
    }

    return CELL_COLOR;
  };

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
      <meshStandardMaterial attach="material" color={getColor()} />
    </mesh>
  );
};

export default Cell;
