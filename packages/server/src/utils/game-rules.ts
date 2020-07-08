import {Board, Cell} from 'reversi-types';

enum DIRECTIONS {
  UP = -10,
  DOWN = 10,
  LEFT = -1,
  RIGHT = 1,
  UP_RIGHT = -9,
  DOWN_RIGHT = 11,
  DOWN_LEFT = 9,
  UP_LEFT = -11,
}

function directionsToNumberArray() {
  return Object.keys(DIRECTIONS).filter((item) => !isNaN(Number(item))).map((item) => +item)
}

/**
  A move must be both valid and legal: it must refer to a real square, and it
  must form a bracket with another piece of the same color with pieces of the
  opposite color in between.
 */

function findBracket(
  move: number,
  playerColor: Cell,
  board: Board,
  direction: DIRECTIONS
) {
  let bracket: number = move + direction;

  if (board[bracket] == playerColor) {
    return undefined;
  }

  const opponent = playerColor === Cell.WHITE ? Cell.BLACK : Cell.WHITE;

  while (board[bracket] === opponent) {
    bracket += direction;
  }

  return board[bracket] === playerColor ? bracket : undefined;
}

function isLegal(move: number, playerColor: Cell, board: Board) {
  return (
    board[move] === Cell.EMPTY &&
    directionsToNumberArray().some((direction) =>
      findBracket(move, playerColor, board, direction as DIRECTIONS)
    )
  );
}

function isValid(move: number) {
  return Number.isInteger(move) && move >= 11 && move <= 89;
}

function makeFlips(move: number, playerColor: Cell, board: Board, direction: DIRECTIONS) {
  const bracket: number | undefined = findBracket(move, playerColor, board, direction);

  if (!bracket) {
    return;
  }

  let currentSquare = move + direction;

  while (currentSquare !== bracket) {
    board[currentSquare] = playerColor;
    currentSquare += direction;
  }
}

function makeMove(move: number, playerColor: Cell, board: Board) {
  const newBoard = [...board];

  if (isValid(move) && isLegal(move, playerColor, newBoard)) {
    newBoard[move] = playerColor;

    directionsToNumberArray().forEach((direction) => {
      makeFlips(move, playerColor, newBoard, direction as DIRECTIONS);
    });
  }

  return newBoard
}

export {
  makeMove
}
