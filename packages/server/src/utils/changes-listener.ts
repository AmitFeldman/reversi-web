import GameModel from '../models/Game';
import EventEmitter from 'eventemitter3';
import {ChangeEventUpdate, ChangeEventCR} from 'mongodb';
import {IGame} from 'reversi-types';
import {onGameUpdate, onNewGame} from './room';

const dbEventEmitter = new EventEmitter();

const NEW_GAME_EVENT = 'NEW_GAME_EVENT';
const GAME_UPDATE_EVENT = 'GAME_UPDATE_EVENT';

const pipeline = [
  {$match: {operationType: {$in: ['insert', 'update']}}},
  {$project: {fullDocument: 1, operationType: 1}},
];

const initChangesListener = () => {
  GameModel.watch(pipeline, {fullDocument: 'updateLookup'}).on(
    'change',
    (data) => {
      const type = data.operationType;

      if (type === 'insert') {
        dbEventEmitter.emit(NEW_GAME_EVENT, data as ChangeEventCR<IGame>);
      } else if (type === 'update') {
        dbEventEmitter.emit(
          GAME_UPDATE_EVENT,
          data as ChangeEventUpdate<IGame>
        );
      }
    }
  );

  dbEventEmitter.on(NEW_GAME_EVENT, onNewGame);
  dbEventEmitter.on(GAME_UPDATE_EVENT, onGameUpdate);
};

export {initChangesListener};
