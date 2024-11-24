import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { JSONRPCServer } from "json-rpc-2.0";

// Define types for room and sockets
interface ChatRoom {
  id: string;
  participants: Set<string>;
}

interface ServerToClientEvents {
  message: (data: { sender: string; color: string; message: string }) => void;
  joined: (room: string) => void;
  typing: () => void;
}

interface ClientToServerEvents {
  sendMessage: (room: string, message: string) => void;
  createRoom: (callback: (roomCode: string) => void) => void;
  joinRoom: (room: string, callback: (success: boolean) => void) => void;
  typing: (room: string) => void;
}

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with CORS options
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
  },
});

// Use CORS middleware to allow cross-origin requests
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// In-memory store for chat rooms
const chatRooms: Map<string, ChatRoom> = new Map();

// Create JSON-RPC server
const rpcServer = new JSONRPCServer();

// Function to generate a random nickname
const generateNickname = () => {
  const adjectives = ["Cool", "Super", "Awesome", "Mighty", "Brave"];
  const nouns = ["Lion", "Tiger", "Bear", "Eagle", "Shark"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);
  return `${adjective}${noun}${number}`;
};

const randomColor = () => {
  const red = Math.floor(Math.random() * 150 + 50);
  const green = Math.floor(Math.random() * 150 + 50);
  const blue = Math.floor(Math.random() * 150 + 50);
  return `rgb(${red}, ${green}, ${blue})`;
};

// Handle socket connections
io.on(
  "connection",
  (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    const nickname = generateNickname();
    const color = randomColor();
    console.log(`${nickname} connected (${socket.id})`);

    // Handle room creation
    socket.on("createRoom", (callback) => {
      const roomCode = Math.random().toString(36).substring(7);
      chatRooms.set(roomCode, {
        id: roomCode,
        participants: new Set([socket.id]),
      });
      socket.join(roomCode);
      console.log(`${nickname} created room: ${roomCode}`);
      callback(roomCode);
    });

    // Handle room joining
    socket.on("joinRoom", (room, callback) => {
      const chatRoom = chatRooms.get(room);
      if (chatRoom) {
        chatRoom.participants.add(socket.id);
        socket.join(room);
        io.to(room).emit("message", {
          sender: "Notification",
          message: `${nickname} has joined the room!`,
          color: "rgb(100, 100, 100)",
        });
        console.log(`${nickname} joined room: ${room}`);
        callback(true);
      } else {
        callback(false);
      }
    });

    // Handle sending messages
    socket.on("sendMessage", (room, message) => {
      const chatRoom = chatRooms.get(room);
      if (chatRoom && chatRoom.participants.has(socket.id)) {
        io.to(room).emit("message", {
          sender: nickname,
          color: color,
          message: message,
        });
      }
    });

    // Hanlde typing event
    socket.on("typing", (room) => {
      io.to(room).emit("typing");
    });

    // Handle disconnections
    socket.on("disconnect", () => {
      console.log(`${nickname} disconnected (${socket.id})`);
      chatRooms.forEach((room, id) => {
        if (room.participants.has(socket.id)) {
          io.to(id).emit("message", {
            sender: "Notification",
            message: `${nickname} has left the room.`,
            color: "rgb(100, 100, 100)",
          });
        }
      });
      chatRooms.forEach((room, id) => {
        if (
          room.participants.delete(socket.id) &&
          room.participants.size === 0
        ) {
          chatRooms.delete(id);
          console.log(`Room ${id} deleted`);
        }
      });
    });
  }
);

// JSON-RPC Room Info Handler
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

// JSON-RPC Middleware
app.post("/rpc", (req, res) => {
  rpcServer.receive(req.body).then((jsonRPCResponse) => {
    if (jsonRPCResponse) res.json(jsonRPCResponse);
    else res.sendStatus(204); // No content
  });
});

// Set the port and start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
