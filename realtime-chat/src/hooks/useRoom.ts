import { ChatRoomData, RPC_ENDPOINT, RPCRequest } from "../utils/rpc";

export const useRoom = () => {
  const fetchRoomInfo = async (room: string | null): Promise<ChatRoomData> => {
    console.log("fetchRoomx1");
    if (!room) {
      throw new Error("Room code is required");
    }
    const requestBody: RPCRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "roomInfo",
      params: { room },
    };

    const response = await fetch(RPC_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("fetchRoomx2", data);

    if (data.error) {
      throw new Error(data.error);
    }
    return data.result;
  };
  return { fetchRoomInfo };
};
