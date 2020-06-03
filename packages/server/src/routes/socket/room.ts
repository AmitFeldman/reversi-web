import {Socket} from 'socket.io';
import {on} from '../../utils/socket-service';
import {BaseArgs, ClientEvents} from '../../types/events';
import {GameType} from '../../models/Game';
import {isLoggedIn} from '../../middlewares/socket-auth';

interface CreateRoomArgs extends BaseArgs {
  gameType: GameType;
};

interface JoinRoomArgs extends BaseArgs {
  roomId: string;
};

const onCreateRoom = (socket: Socket, callback: (data: CreateRoomArgs) => void) => {
  on<CreateRoomArgs>(socket, ClientEvents.CreateRoom, isLoggedIn, callback);
};

const onJoinRoom = (socket: Socket, callback: (data: JoinRoomArgs) => void) => {
  on<JoinRoomArgs>(socket, ClientEvents.Ready, isLoggedIn, callback);
};

export {onCreateRoom, onJoinRoom};
