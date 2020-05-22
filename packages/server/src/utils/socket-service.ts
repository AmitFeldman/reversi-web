import socketIO, {Server, Socket} from 'socket.io';
import {express as expressConfig} from '../config/config';
import http from 'http';
import {Express} from 'express';

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
};

// Emit event only to sockets connected to room
const emitEventInRoom = (room: string, event: string, ...args: any[]) => {
  io.sockets.in(room).emit(event, ...args);
};

// Emit an event to all connected sockets, same API as io.emit
const emitEvent = (event: string, ...args: any[]) => {
  io.emit(event, ...args);
};

export {initSocketIO, emitEventInRoom, onConnect, emitEvent};
