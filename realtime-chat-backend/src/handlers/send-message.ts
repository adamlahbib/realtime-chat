import { Socket } from "socket.io";
import { chatRooms, IOServerType } from "../config";

export function sendMessageHandler(
  socket: Socket,
  io: IOServerType,
  room: string,
  nickname: string,
  color: string,
  message: string
) {
  return () => {
    const chatRoom = chatRooms.get(room);
    if (
      chatRoom &&
      Array.from(chatRoom.participants).some((p) => p.id === socket.id)
    ) {
      io.to(room).emit("message", {
        sender: nickname,
        color: color,
        message: message,
      });
    }
  };
}
