import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, ChatRoom } from "./types";
import { generateNickname, randomColor } from "./utils";
import { io } from "./config";
import {
  createRoomHandler,
  disconnectionHandler,
  joinRoomHandler,
  sendMessageHandler,
} from "./handlers";

// Handle socket connections
io.on(
  "connection",
  (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    const nickname = generateNickname();
    const color = randomColor();
    console.log(`${nickname} connected (${socket.id})`);

    // Handle room creation
    socket.on("createRoom", (callback) =>
      createRoomHandler(socket, nickname, color)(callback)
    );

    // Handle room joining
    socket.on("joinRoom", (room, callback) =>
      joinRoomHandler(socket, io, room, nickname, color)(callback)
    );

    // Handle sending messages
    socket.on("sendMessage", (room, message) =>
      sendMessageHandler(socket, io, room, nickname, color, message)()
    );

    // Hanlde typing event
    socket.on("typing", (room) => {
      io.to(room).emit("typing");
    });

    // Handle disconnections
    socket.on("disconnect", () => disconnectionHandler(socket, io, nickname)());
  }
);
