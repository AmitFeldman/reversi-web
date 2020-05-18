import {Document} from 'mongoose';

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  date: string;
}

export const EVENT_GAME_CREATED = 'game-created'
export const EVENT_GAME_JOINED = 'game-joined'
export const EVENT_STATE_CHANGED = 'game-state-changed'
export const EVENT_GAME_FINISHED = 'game-finished'

interface Game extends document {
  name: string
  readonly whitePlayer: Player
  blackPlayer: Player | undefined,
  status: string,
  turn: Disc,
  board: number[]
}

type Board = number[][]

interface Player {
  readonly token: string
  name?: string
}


interface Position {
  readonly x: number
  readonly y: number
}
