import {connect} from 'socket.io-client';

const SOCKET_URI = 'http://localhost:7000';
const socket = connect(SOCKET_URI);

export type EventCallback<D> = (data: D) => void;

// Adds a listener for event
const onEvent = <D>(event: string, callback: EventCallback<D>) => {
  socket.addEventListener(event, callback);

  return () => socket.removeEventListener(event, callback);
};

// Emit event to server
const emitEvent = <D>(event: string, ...args: D[]) => {
  socket.emit(event, ...args);
};

export {onEvent, emitEvent};
