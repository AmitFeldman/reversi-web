import {BaseArgs, ClientEvents} from 'reversi-types';
import {emitEvent} from './socket-client';

const authConnect = (args: BaseArgs) =>
  emitEvent<BaseArgs>(ClientEvents.AUTH_CONNECT, args);

const authDisconnect = (args: BaseArgs) =>
  emitEvent<BaseArgs>(ClientEvents.AUTH_DISCONNECT, args);

export {authConnect, authDisconnect};
