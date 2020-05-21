import {GameType} from './reversi-types';

enum UserEvents {
  CreateRoom = 'CREATE_ROOM',
  Ready = 'READY',
}

interface RoomSettings {
  type: GameType
}

interface CreateRoomArgs {
  settings: {

  }
}

enum ServerEvents {
  CreatedRoom = 'CREATED_ROOM',
}

export {UserEvents, ServerEvents};
export type { CreateRoomArgs };

