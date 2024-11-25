import { Socket } from "socket.io";
import { chatRooms, IOServerType } from "../config";

export function joinRoomHandler(
  socket: Socket,
  io: IOServerType,
  room: string,
  nickname: string,
  color: string
): (callback: (status: boolean) => void) => void {
  return (callback: (status: boolean) => void) => {
    const chatRoom = chatRooms.get(room);
    if (chatRoom) {
      chatRoom.participants.add({ id: socket.id, nickname, color: color });
      socket.join(room);
      io.to(room).emit("message", {
        sender: "Notification",
        message: `${nickname} has joined the room!`,
        color: "rgb(100, 100, 100)",
      });
      io.to(room).emit("refetchParticipants");
      console.log(`${nickname} joined room: ${room}`);
      callback(true);
    } else {
      callback(false);
    }
  };
}
