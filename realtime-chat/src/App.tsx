import React, { useState } from 'react';
import { useChat } from './hooks/useChat';
import { useWindowSize } from './hooks/useWindowSize';
import RoomSelector from './components/RoomSelector';
import ChatRoom from './components/ChatRoom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const { roomCode, setRoomCode, currentRoom, messages, typing, loading, handleCreateRoom, handleJoinRoom, sendMessage, sendTyping, participants } = useChat();
  const maxMessages = useWindowSize();
  const [message, setMessage] = useState('');

  return !currentRoom ? (
    <>
    <ToastContainer />
    <RoomSelector
      roomCode={roomCode}
      setRoomCode={setRoomCode}
      onCreateRoom={handleCreateRoom}
      onJoinRoom={handleJoinRoom}
    />
    </>
  ) : (
    <ChatRoom
      currentRoom={currentRoom}
      messages={messages}
      typing={typing}
      loading={loading}
      maxMessages={maxMessages}
      message={message}
      setMessage={setMessage}
      onSendMessage={() => {
        sendMessage(message);
        setMessage('');
      }}
      onTyping = {() => {
        sendTyping();
      }}
      participants={participants}
    />
  );
};

export default App;
