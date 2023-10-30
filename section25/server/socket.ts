import { Server } from "socket.io";

let io: Server | undefined;

export const socketService = {
  init: (httpServer: any): Server => {
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    return io;
  },
  getIO: (): Server => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  },
};
