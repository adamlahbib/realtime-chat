// Define types for room and sockets
interface Participant {
  id: string;
  nickname: string;
  color: string;
}

export interface ChatRoom {
  id: string;
  participants: Set<Participant>;
}

export interface ServerToClientEvents {
  message: (data: { sender: string; color: string; message: string }) => void;
  joined: (room: string) => void;
  typing: () => void;
  refetchParticipants: () => void;
}

export interface ClientToServerEvents {
  sendMessage: (room: string, message: string) => void;
  createRoom: (callback: (roomCode: string) => void) => void;
  joinRoom: (room: string, callback: (success: boolean) => void) => void;
  typing: (room: string) => void;
}
