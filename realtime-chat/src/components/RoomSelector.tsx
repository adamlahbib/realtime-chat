import React from 'react';
import MultiInput from './MultiInput';

interface RoomSelectorProps {
  roomCode: string;
  setRoomCode: (code: string) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ roomCode, setRoomCode, onCreateRoom, onJoinRoom }) => (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
    <h1 className="text-4xl font-bold mb-8">Real-Time Chat</h1>
    <div className="messages flex flex-col w-full bg-white shadow-md rounded-lg p-4 mb-4 overflow-y-auto"
    style = {{
        height: `calc(100vh - 400px)`,
        maxWidth: `calc(100vw - 200px)`
    }}
    >
      <div style={{ marginBottom: '20px' }} className="flex flex-col gap-4 items-center justify-center align-middle h-full">
      <h2 className="text-xl font-bold mb-4">Create or join a room to start chatting!</h2>
        <button onClick={onCreateRoom}
          className="bg-blue-500 w-1/3 text-white p-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Room
        </button>
        OR
        <MultiInput code={roomCode} onChange={setRoomCode} />
        <button onClick={onJoinRoom}
          className="bg-blue-500 w-1/3 text-white p-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >Join Room</button>
      </div>
    </div>
    </div>
);

export default RoomSelector;
