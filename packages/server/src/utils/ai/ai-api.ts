
import {Board, Cell, GameType} from 'reversi-types';
import server from './server-api';

export type Strategy = "random" | "max-diff" | "max-weighted-diff" | "minimax-diff" | "minimax-weighted-diff" | "ab-diff" | "ab-weighted-diff" | undefined;

const gameTypesToStrategy = new Map<GameType, Strategy>();

gameTypesToStrategy.set("AI_EASY", "random");
gameTypesToStrategy.set("AI_MEDIUM", "max-diff");
gameTypesToStrategy.set("AI_HARD", "minimax-diff");
gameTypesToStrategy.set("AI_EXPERT", "ab-weighted-diff");

export interface AiBody {
  strategy: Strategy,
  color: Cell,
  board: Board
}

const ai_play = async (aiData: AiBody): Promise<number> => {
  return await server<AiBody, number>('ai_play', {
    body: aiData,
  });
};

export {ai_play, gameTypesToStrategy};
