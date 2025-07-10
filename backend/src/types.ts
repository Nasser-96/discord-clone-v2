import { Socket } from 'socket.io';

export type AuthPayloadType = {
  username?: string;
  user_id?: string;
};

export type SocketWithAuth = Socket & AuthPayloadType;
