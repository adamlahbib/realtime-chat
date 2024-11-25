import { Socket } from "socket.io";
import { chatRooms, IOServerType } from "../config";

export function disconnectionHandler(
  socket: Socket,
  io: IOServerType,
  nickname: string
) {
  return () => {
    console.log(`${nickname} disconnected (${socket.id})`);
    chatRooms.forEach((room, id) => {
      if (Array.from(room.participants).some((p) => p.id === socket.id)) {
        io.to(id).emit("message", {
          sender: "Notification",
          message: `${nickname} has left the room.`,
          color: "rgb(100, 100, 100)",
        });
        io.to(id).emit("refetchParticipants");
      }
      room.participants = new Set(
        Array.from(room.participants).filter((p) => p.id !== socket.id)
      );
      if (room.participants.size === 0) {
        chatRooms.delete(id);
        console.log(`Room ${id} deleted`);
      }
      return;
    });
  };
}
