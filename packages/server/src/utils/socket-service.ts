import socketIO, {Server, Socket} from 'socket.io';
import {express as expressConfig} from '../config/config';
import http from 'http';
import {Express} from 'express';
import {parseToken} from '../middlewares/socket-auth';
import {BaseArgs, ClientEvents} from 'reversi-types';

const CONNECT_EVENT = 'connection';
const DISCONNECT_EVENT = 'disconnect';

let io: Server;

const initSocketIO = (app: Express) => {
  const socketServer = new http.Server(app);
  io = socketIO(socketServer);

  // Socket server listening
  const {socketPort} = expressConfig;
  socketServer.listen(socketPort);
  console.log(`socket listening on port ${socketPort}...`);

  onConnect((socket) => { console.log(`Socket connected: ${socket.id}`);

    const cancelOnDisconnect = onDisconnect(socket, (reason) => {
      cancelOnDisconnect();
      console.log(`Socket disconnected: ${socket.id} | Reason: ${reason}`);
    });
  });
};

const onConnect = (listener: (socket: Socket) => void) => {
  io.on(CONNECT_EVENT, listener);
};

const onDisconnect = (socket: Socket, callback: (reason: string) => void) => {
  socket.on(DISCONNECT_EVENT, callback);

  return () => socket.off(DISCONNECT_EVENT, callback);
};

// Emit event only to sockets connected to room
const emitEventToRoom = (room: string, event: string, ...args: any[]) => {
  io.sockets.in(room).emit(event, ...args);
};

const emitEventToSocket = (socket: Socket, event: string, ...args: any[]) => {
  socket.emit(event, ...args);
};

// Emit events to all clients except specified socket in room
const emitEventToOtherClientsInRoom = (
  socket: Socket,
  room: string,
  event: string,
  ...args: any[]
) => {
  socket.to(room).emit(event, ...args);
};

// Emit an event to all connected sockets, same API as io.emit
const emitEventToAllSockets = (event: string, ...args: any[]) => {
  io.emit(event, ...args);
};

const joinRoom = (socket: Socket, room: string | string[]) => {
  socket.join(room);
};

export type Middleware<Data extends BaseArgs> = (
  data: Data,
  next: Function
) => void;

const on = <Data extends BaseArgs>(
  socket: Socket,
  event: ClientEvents,
  ...callbacks: Middleware<Data>[]
): (() => void) => {
  const listeners = [parseToken, ...callbacks];

  const listener = (data: Data) => {
    const next = (index: number) => {
      if (index === listeners.length) {
        console.log(
          `Socket Service ERROR: last callback passed to on: ${event} cannot run next function`
        );
      }

      listeners[index](data, () => next(index + 1));
    };

    next(0);
  };

  socket.on(event, listener);
  return () => socket.off(event, listener);
};

export {
  initSocketIO,
  emitEventToRoom,
  onConnect,
  emitEventToAllSockets,
  emitEventToSocket,
  emitEventToOtherClientsInRoom,
  joinRoom,
  on,
  onDisconnect
};
