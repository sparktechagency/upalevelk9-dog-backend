// import { Server } from 'socket.io';

// const socket = (io: Server) => {
//   io.on('connection', socket => {
//     console.log('👤 A user connected');

//     socket.on('join', userId => {
//       socket.join(userId);
//       console.log(`User ${userId} joined room`);
//     });
//     //disconnect user
//     socket.on('disconnect', () => {
//       console.log('A user disconnected');
//     });
//   });
// };

// export default socket;

import { Server } from 'socket.io';

const io = new Server(); // Initialize io instance

const socket = (io: Server) => {
  io.on('connection', socket => {
    console.log('👤 A user connected');

    socket.on('join', userId => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // Disconnect user
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

socket(io); // Call the function to initialize socket connection

export { io }; // Export io to be used elsewhere
export default socket;
