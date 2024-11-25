export interface ChatRoomParticipant {
  id: string;
  nickname: string;
}

export interface RPCRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params?: Record<string, unknown>;
}

export interface RPCResponse<T> {
  jsonrpc: string;
  id: number;
  result: T;
  error?: string;
}

export interface ChatRoomData {
  id: string;
  participants: ChatRoomParticipant[];
}

export const RPC_ENDPOINT = "http://localhost:4000/rpc";
