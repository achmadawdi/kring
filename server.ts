import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import { parse } from "url";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Store widget states in memory for MVP
  // In a real app, this would be in a database
  const roomStates: Record<string, any> = {};

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);

      // Send current state to the newly connected client
      if (roomStates[roomId]) {
        socket.emit("sync-state", roomStates[roomId]);
      }
    });

    socket.on("update-state", (roomId: string, state: any) => {
      roomStates[roomId] = state;
      // Broadcast to everyone in the room except sender
      socket.to(roomId).emit("sync-state", state);
    });

    socket.on("trigger-alert", (roomId: string, alertData: any) => {
      // Broadcast alert to the room
      io.to(roomId).emit("play-alert", alertData);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  expressApp.all(/.*/, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
