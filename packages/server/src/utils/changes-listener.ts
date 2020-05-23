import GameModel, {IGame} from '../models/Game';
import BsonObjectId from 'bson-objectid';
import EventEmitter from 'eventemitter3';
import {ChangeEventUpdate, ChangeEventCR} from 'mongodb';

const dbEventEmitter = new EventEmitter();

const NEW_GAME_EVENT = 'NEW_GAME_EVENT';
const GAME_UPDATE_EVENT = 'GAME_UPDATE_EVENT';

const pipeline = [
  {$match: {operationType: {$in: ['insert', 'update']}}},
  {$project: {fullDocument: 1, operationType: 1}},
];

// Parse bson to normal id
const bsonToObjectId = (bsonItem: BsonObjectId) =>
  new BsonObjectId(bsonItem.id).str;

const initChangesListener = () => {
  GameModel.watch(pipeline, {fullDocument: 'updateLookup'}).on(
    'change',
    (data) => {
      const type = data.operationType;

      if (type === 'insert') {
        console.log("A game has been inserted");
        dbEventEmitter.emit(NEW_GAME_EVENT, data as ChangeEventCR<IGame>);
      } else if (type === 'update') {
        console.log("A game has been updated");
        dbEventEmitter.emit(
          GAME_UPDATE_EVENT,
          data as ChangeEventUpdate<IGame>
        );
      }
    }
  );
};

const onNewGame = (callback: (change: ChangeEventCR<IGame>) => void) => {
  dbEventEmitter.on(NEW_GAME_EVENT, callback);
};

const onGameUpdate = (callback: (change: ChangeEventUpdate<IGame>) => void) => {
  dbEventEmitter.on(GAME_UPDATE_EVENT, callback);
};

export {initChangesListener, onNewGame, onGameUpdate};
