import {Board, Cell} from 'reversi-types';

const BOARD_LENGTH = 100;

const getInitialBoard = (): Board => {
  const board = new Array<Cell>(BOARD_LENGTH).fill(Cell.OUTER);

  return board.map((value, index) => {
    if (index === 45 || index === 54) {
      return Cell.BLACK;
    }

    if (index === 44 || index === 55) {
      return Cell.WHITE;
    }

    if (index >= 11 && index <= 89 && index % 10 >= 1 && index % 10 <= 8) {
      return Cell.EMPTY;
    }

    return value;
  });
};

const getBoardCell = (board: Board, row: number, column: number): Cell => {
  const index = Number(`${row}${column}`);

  return board[index];
};

const mapOverBoard = (
  board: Board,
  map: (cell: Cell, row: number, column: number, index: number) => any
) => {
  const indexes = Array.from(Array(64).keys());

  const getCell = (row: number, column: number) =>
    getBoardCell(board, row, column);

  return indexes.map((index) => {
    const row = Math.floor(index / 8) + 1;
    const col = (index % 8) + 1;

    return map(getCell(row, col), row, col, index);
  });
};

export {getInitialBoard, getBoardCell, mapOverBoard};
