import EventEmitter from 'eventemitter3';
import {Server} from 'socket.io';
// import {Cell} from 'reversi-types';

let io: Server;
// class IoEventEmitter extends EventEmitter {}

// const ioEventEmitter = new IoEventEmitter();
const connectEvent = 'connection';
const disconnectEvent = 'disconnect';

let board = new Array(64).fill(0);

const initSocketIO = (newSocketIO: Server) => {
  io = newSocketIO;

  io.on(connectEvent, socket => {
    console.log(`Socket connected: ${socket.id}`);

    // ioEventEmitter.emit(connectEvent, socket);

    socket.on(disconnectEvent, () => {
      // ioEventEmitter.emit(disconnectEvent, socket);
      console.log(`Socket disconnected ${socket.id}`);
    });

    socket.on('joinRoom', (msg: string) => {
      console.log(msg);
    });

    // can be when user is removed from the collection
    socket.on('leaveRoom', (msg: string) => {
      console.log(msg);
    });

    // Player vs Player we will use socket.boradcast.emit

    socket.on('playerMove', (turn) => {
      const {location, value} = JSON.parse(turn);

      console.log(`Move with index ${location} and value ${value}`);

      board[location] = value;
      board[location + 1] = 2;

      io.emit('playerMove', board);
    });
  });

  // io.on('connection', (socket) => {
  //   socket.broadcast.emit('hi');
  // });
};

// // Emit an event to all connected sockets, same API as io.emit
// const emitEvent = (event, ...args) => {
//   io.emit(event, ...args);
// };

export {initSocketIO};
