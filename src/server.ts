import mongoose from 'mongoose';
import { app } from './app';
import config from './config/index';
import { errorLogger, logger } from './shared/logger';
import { Server } from 'socket.io';
import socket from './socket/socket';

process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

// let server: Server;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let server: any;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('DB Connected on Successfully');

    const port =
      typeof config.port === 'number' ? config.port : Number(config.port);
    server = app.listen(port, config.base_url as string, () => {
      logger.info(`Example app listening on port ${config.port}`);
    });

    const socketIO = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });
    socket(socketIO);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    global.io = socketIO;
  } catch (error) {
    errorLogger.error(error);
    throw error;
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
main().catch(err => errorLogger.error(err));

process.on('SIGTERM', () => {
  console.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
