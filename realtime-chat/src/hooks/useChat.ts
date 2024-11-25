import { useState, useEffect, useCallback } from "react";
import { MessageType, socket } from "../utils/socket";
import { useRoom } from "./useRoom";
import { ChatRoomData } from "../utils/rpc";
import { toast } from "react-toastify";

export const useChat = () => {
  const [roomCode, setRoomCode] = useState<string>("");
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState<ChatRoomData | null>(null);
  const { fetchRoomInfo } = useRoom();

  const refetchParticipants = useCallback(
    async (roomCode: string | null) => {
      if (!roomCode) {
        console.warn("No room to fetch participants for");
        return;
      }
      try {
        const data = await fetchRoomInfo(roomCode);
        setParticipants(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    },
    [fetchRoomInfo]
  );

  const handleCreateRoom = () => {
    socket.emit("createRoom", async (newRoomCode: string) => {
      if (newRoomCode) {
        setCurrentRoom(newRoomCode);
        setRoomCode(newRoomCode);
        await refetchParticipants(newRoomCode);
      }
    });
  };

  const handleJoinRoom = () => {
    if (roomCode.trim() === "") {
      toast.error("Room code is required!");
      return;
    }
    socket.emit("joinRoom", roomCode, async (status: boolean) => {
      if (status) {
        setCurrentRoom(roomCode);
        await refetchParticipants(roomCode);
      } else {
        toast.error("Room not found!");
      }
    });
  };

  const sendMessage = (message: string) => {
    if (currentRoom && message.trim()) {
      setLoading(true);
      socket.emit("sendMessage", currentRoom, message);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const sendTyping = () => {
    if (currentRoom) {
      socket.emit("typing", currentRoom);
    }
  };

  useEffect(() => {
    const handleNewMessage = (message: MessageType) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleTyping = () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 500);
    };

    const handleRefetchParticipants = () => {
      refetchParticipants(currentRoom);
    };

    socket.on("message", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("refetchParticipants", handleRefetchParticipants);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("refetchParticipants", handleRefetchParticipants);
    };
  }, [currentRoom, refetchParticipants]);

  return {
    roomCode,
    setRoomCode,
    currentRoom,
    messages,
    loading,
    typing,
    handleCreateRoom,
    handleJoinRoom,
    sendMessage,
    sendTyping,
    participants,
  };
};
