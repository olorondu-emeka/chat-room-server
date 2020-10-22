import socketIO from 'socket.io';

let io;

export default {
  init: (httpServer) => {
    io = socketIO(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket not connected');
    }
    return io;
  }
};
