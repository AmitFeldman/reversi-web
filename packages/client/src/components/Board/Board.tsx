import * as React from 'react';
import Cell from '../Cell/Cell';
import {Vector3} from 'three';
import Frame from './Frame/Frame';
import Disc from '../Disc/Disc';

const BOARD_SIZE = 8;
const BOARD_HEIGHT = 0.1;
const GRID_BUFFER = 0.01;
const BLACK = 0x000000;
const CELL_SIZE = 1;

interface BoardProps {
  position?: Vector3;
}

const Board: React.FC<BoardProps> = ({position = new Vector3(0, 0, 0)}) => {
  const boardY = position.y - GRID_BUFFER - BOARD_HEIGHT / 2;

  const cellCount = BOARD_SIZE * BOARD_SIZE;
  const cells = Array.from(new Array(cellCount).keys());

  const [discs, setDiscs] = React.useState<number[]>([]);

  return (
    <>
      <mesh scale={[1, 1, 1]} position={position}>
        <gridHelper args={[BOARD_SIZE, BOARD_SIZE, BLACK, BLACK]} />
      </mesh>
      <Frame
        boardPosition={new Vector3(position.x, boardY, position.z)}
        boardSize={BOARD_SIZE * CELL_SIZE}
        boardHeight={BOARD_HEIGHT}
      />
      {cells.map((cell) => (
        <Cell
          onClick={(id) => {
            if (!discs.includes(id)) {
              setDiscs([...discs, id]);
            } else {
              setDiscs(discs.filter((d) => d !== id));
            }
          }}
          id={cell}
          key={cell}
          position={
            new Vector3(
              position.x + (cell % 8) - BOARD_SIZE / 2 + CELL_SIZE / 2,
              boardY,
              position.z + Math.floor(cell / 8) - BOARD_SIZE / 2 + CELL_SIZE / 2
            )
          }
          cellHeight={BOARD_HEIGHT}
          cellSize={CELL_SIZE}
        />
      ))}
      {discs.map((id) => (
        <Disc
          key={id}
          position={
            new Vector3(
              position.x + (id % 8) - BOARD_SIZE / 2 + 0.5,
              position.y,
              position.z + Math.floor(id / 8) - BOARD_SIZE / 2 + 0.5
            )
          }
        />
      ))}
    </>
  );
};

export default Board;
