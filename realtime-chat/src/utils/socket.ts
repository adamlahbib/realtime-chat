import io, { Socket } from "socket.io-client";

export interface MessageType {
  sender: string;
  color: string;
  message: string;
}

interface ServerToClientEvents {
  joined: (room: string) => void;
  message: (data: { sender: string; color: string; message: string }) => void;
  typing: () => void;
  refetchParticipants: () => void;
}

interface ClientToServerEvents {
  sendMessage: (room: string, message: string) => void;
  createRoom: (callback: (roomCode: string) => void) => void;
  joinRoom: (room: string, callback: (success: boolean) => void) => void;
  typing: (room: string) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:4000"
);
