import socketIO, {Server, Socket} from 'socket.io';
import {express as expressConfig} from '../config/config';
import http from 'http';
import {Express} from 'express';
import {BaseArgs, ClientEvents} from '../types/events';
import {parseToken} from '../middlewares/socket-auth';

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

  onConnect((socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on(DISCONNECT_EVENT, (reason) => {
      console.log(`Socket disconnected: ${socket.id} | Reason: ${reason}`);
    });
  });
};

const onConnect = (listener: (socket: Socket) => void) => {
  io.on(CONNECT_EVENT, listener);

  // TODO: Return off?
};

const onDisconnect = (socket: Socket, callback: () => void) => {
  socket.on(DISCONNECT_EVENT, callback);
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

export type Middleware<Data extends BaseArgs> = (data: Data, next: Function) => void;

const on = <Data extends BaseArgs>(
  socket: Socket,
  event: ClientEvents,
  ...callbacks: Middleware<Data>[]
) => {
  callbacks.unshift(parseToken);

  const listener = (data: Data) => {
    const next = () => {
      callbacks.shift();
      callbacks[0](data, next);
    };

    callbacks[0](data, next);
  };

  socket.on(event, listener);

  // return socket.off(event, listener);
};

export {
  initSocketIO,
  emitEventToRoom,
  onConnect,
  emitEventToAllSockets,
  emitEventToSocket,
  emitEventToOtherClientsInRoom,
  onDisconnect,
  joinRoom,
  on,
};
