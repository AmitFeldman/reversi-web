export type PositionArray = [number, number, number];

//TODO: Cleanup
export const BOARD_SIZE = 8;
export const BOARD_HEIGHT = 0.1;
export const GRID_BUFFER = 0.01;
export const BLACK = 0x000000;
export const CELL_SIZE = 1;
export const GRID_CENTER_X = 0;
export const GRID_CENTER_Y = 0;
export const GRID_CENTER_Z = 0;
export const BOARD_CENTER_Y = GRID_CENTER_Y - GRID_BUFFER - BOARD_HEIGHT / 2;
export const CENTER_POSITION: PositionArray = [GRID_CENTER_X, GRID_CENTER_Y, GRID_CENTER_Z];
export const BOARD_POSITION: PositionArray = [GRID_CENTER_X, BOARD_CENTER_Y, GRID_CENTER_Z];
