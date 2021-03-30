import socketIO from 'socket.io-client';
import { onEvent, emitEvent } from './consts';
import { SERVER_URL } from '../config';

export const initSocket = (param) => {
  const socket = socketIO.connect(SERVER_URL, {
    path: "/socket"
  });

  socket.on(onEvent.HELLO_WORLD, (data) => {
    param?.alert(data.text);
  });

  return socket;
};