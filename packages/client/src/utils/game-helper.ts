import {Board, Cell} from 'reversi-types';

const getInitialBoard = (): Board => {
  const board = new Array<Cell>(64).fill(Cell.EMPTY);
  board[27] = board[36] = Cell.BLACK;
  board[28] = board[35] = Cell.WHITE;

  return board;
};

export {getInitialBoard};
