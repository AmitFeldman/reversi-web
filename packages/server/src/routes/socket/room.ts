import {Socket} from 'socket.io';
import {Middleware, on} from '../../utils/socket-service';
import {BaseArgs, ClientEvents} from '../../types/events';
import {GameType} from '../../models/Game';
import {isLoggedIn} from '../../middlewares/socket-auth';

interface CreateRoomArgs extends BaseArgs {
  gameType: GameType;
};

interface JoinRoomArgs extends BaseArgs {
  roomId: string;
};

const onCreateRoom = (socket: Socket, ...callbacks: Middleware<CreateRoomArgs>[]) => {
  on<CreateRoomArgs>(socket, ClientEvents.CreateRoom, isLoggedIn, ...callbacks);
};

const onJoinRoom = (socket: Socket, ...callbacks: Middleware<JoinRoomArgs>[]) => {
  on<JoinRoomArgs>(socket, ClientEvents.JOINED, isLoggedIn, ...callbacks);
};

export {onCreateRoom, onJoinRoom};
