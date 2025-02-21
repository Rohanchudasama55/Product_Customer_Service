import { Server } from "socket.io";

let io;

export const initializeSocket = async (server) => {
  try {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    io.on("connection", (socket) => {
      console.log(`New client connected: ${socket.id}`);
      socket.on("sendMessage", (data) => {
        console.log("Message received:", data);
        io.emit("newMessage", data);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
    return io;
  } catch (error) {
    throw new error;
  }
};

export { io };
