import * as React from 'react';

const BOARD_SIZE = 8;
const BOARD_DIVISIONS = 8;
const BOARD_HEIGHT = 2;
const GRID_BUFFER = 0.01;

interface BoardProps {
  position: [number, number, number];
}

const Board: React.FC<BoardProps> = ({position = [0, 0, 0]}) => {
  const boardPosition: [number, number, number] = [
    position[0],
    position[1] - GRID_BUFFER - BOARD_HEIGHT / 2,
    position[2],
  ];

  return (
    <>
      <mesh scale={[1, 1, 1]} position={position}>
        <gridHelper args={[BOARD_SIZE, BOARD_DIVISIONS, 0x000000, 0x000000]} />/>
      </mesh>
      <mesh scale={[1, 1, 1]} position={boardPosition}>
        <boxBufferGeometry
          attach="geometry"
          args={[BOARD_SIZE, BOARD_HEIGHT, BOARD_SIZE]}
        />
        <meshStandardMaterial attach="material" color={0x008000} />
      </mesh>
    </>
  );
};

export default Board;
