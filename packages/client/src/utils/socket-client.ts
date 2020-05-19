import {connect} from 'socket.io-client';

const SOCKET_URI = 'http://localhost:7000';
const socket = connect(SOCKET_URI);

export type SocketEvent = 'NEW_POST' | 'playerMove';
export type EventCallback<D> = (data: D) => void;

// setTimeout(() => {
//   socket.emit("maaaa", "heyyyy");
//   socket.emit('joinRoom', 'asdasd');
// }, 10000);

// Adds a listener for socket event
const onSocketEvent = <D>(event: SocketEvent, callback: EventCallback<D>) => {
  socket.addEventListener(event, callback);

  return () => socket.removeEventListener(event, callback);
};

// Emit event to server
const emitEvent = <D>(event: string, ...args: D[]) => {
  socket.emit(event, ...args);
};

export {onSocketEvent, emitEvent};
