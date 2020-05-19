import * as React from 'react';
import Frame from '../Frame/Frame';
import {
  BLACK,
  BOARD_SIZE,
  CENTER_POSITION,
} from '../../constants/game-constants';

// Static parts of the board (grid and board frame)
const Board: React.FC = ({children}) => {
  return (
    <>
      <mesh scale={[1, 1, 1]} position={CENTER_POSITION}>
        <gridHelper args={[BOARD_SIZE, BOARD_SIZE, BLACK, BLACK]} />
      </mesh>

      <Frame />

      {children}
    </>
  );
};

export default Board;
