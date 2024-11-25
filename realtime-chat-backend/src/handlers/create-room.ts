import { Socket } from "socket.io";
import { chatRooms } from "../config";

export function createRoomHandler(
  socket: Socket,
  nickname: string,
  color: string
): (callback: (roomCode: string) => void) => void {
  return (callback: (roomCode: string) => void) => {
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    chatRooms.set(roomCode, {
      id: roomCode,
      participants: new Set([{ id: socket.id, nickname, color: color }]),
    });
    socket.join(roomCode);
    console.log(`${nickname} created room: ${roomCode}`);
    callback(roomCode);
  };
}
