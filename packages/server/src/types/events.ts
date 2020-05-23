import {Board, GameStatus, GameType, IPlayer} from '../models/Game';

enum ClientEvents {
  CreateRoom = 'CREATE_ROOM',
  Ready = 'READY',
  PlayerMove = 'PLAYER_MOVE',
}

export interface BaseArgs {
  token: string;
}

export interface PlayerMoveArgs extends BaseArgs {
  index: number;
}

enum ServerEvents {
  CreatedRoom = 'CREATED_ROOM',
  GameUpdated = 'GAME_UPDATE'
}

export type moveResponse = {
  gameStatus: GameStatus;
  board: Board;
};

export {ClientEvents, ServerEvents};
