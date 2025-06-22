import { Socket } from 'socket.io';
import { IAccessTokenPayload } from './token-payload';

declare module 'socket.io' {
  interface Socket {
    user?: IAccessTokenPayload;
  }
}