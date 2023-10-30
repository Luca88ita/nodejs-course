import { Server } from "http";
import { Server as HTTPServer } from "socket.io";

let io: HTTPServer | undefined;

export const socketService = {
  init: (httpServer: Server): HTTPServer => {
    io = new HTTPServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    return io;
  },
  getIO: (): HTTPServer => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  },
};
