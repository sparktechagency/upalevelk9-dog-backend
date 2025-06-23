/* eslint-disable @typescript-eslint/no-explicit-any */
// import { io } from './socket';

// export const SocketResponse = (data: any) => {
//   return {
//     message: data?.message,
//     data: data,
//   };
// };
// export const emitMessage = (key: any, data: any) => {
//   io.emit(key, data);
// };

import { io } from './socket'; // Import io from socket.ts

export const SocketResponse = (data: any) => {
  return {
    message: data?.message,
    data: data,
  };
};

export const emitMessage = (key: any, data: any) => {
  io.emit(key, data); // Emit message using the io instance
};
