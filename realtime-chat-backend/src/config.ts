import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { JSONRPCServer } from "json-rpc-2.0";
import { ClientToServerEvents, ServerToClientEvents, ChatRoom } from "./types";

export const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(
  cors({
    origin: "*",
  })
);

// Create HTTP server
export const server = http.createServer(app);

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
  server,
  {
    cors: {
      origin: "*",
    },
  }
);

export type IOServerType = typeof io;

app.use(express.json());

// In-memory store for chat rooms
export const chatRooms: Map<string, ChatRoom> = new Map();

// Create JSON-RPC server
export const rpcServer = new JSONRPCServer();

rpcServer.addMethod("roomInfo", ({ room }: { room: string }) => {
  const chatRoom = chatRooms.get(room);
  if (chatRoom) {
    return {
      id: chatRoom.id,
      participants: Array.from(chatRoom.participants),
    };
  }
  throw new Error("Room not found");
});

app.post(
  "/rpc",
  (
    req: { body: any },
    res: { json: (arg0: any) => void; sendStatus: (arg0: number) => void }
  ) => {
    rpcServer.receive(req.body).then((jsonRPCResponse: any) => {
      if (jsonRPCResponse) res.json(jsonRPCResponse);
      else res.sendStatus(204); // No content
    });
  }
);

// Set the port and start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io, chatRooms, rpcServer };
