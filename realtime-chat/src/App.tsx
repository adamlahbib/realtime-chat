import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useTransition, animated } from '@react-spring/web';
import Message from './Message';
import { FaPaperPlane } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import { LoadingScene, TypingScene } from './components/Anims';
import MultiInput from './components/MultiInput';

const ANIMATION_DURATION = 500 

// Define the shape of a message object
interface ServerToClientEvents {
  joined: (room: string) => void;
  message: (data: { sender: string; color: string; message: string }) => void;
  typing: () => void;
}

interface ClientToServerEvents {
  sendMessage: (room: string, message: string) => void;
  createRoom: (callback: (roomCode: string) => void) => void;
  joinRoom: (room: string, callback: (success: boolean) => void) => void;
  typing: (room: string) => void;
}

interface MessageType {
  sender: string;
  color: string;
  message: string;
}

// Create a socket.io client
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:4000');

const App: React.FC = () => {
  const [roomCode, setRoomCode] = useState<string>('');
  const [currentRoom, setCurrentRoom] = useState<string|null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState<string>('');
  const [maxMessages, setMaxMessages] = useState<number>(10);
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)

  const handleCreateRoom = () => {
    socket.emit('createRoom', (newRoomCode: string) => {
        setCurrentRoom(newRoomCode);
        setRoomCode(newRoomCode);
        console.log(`Created room: ${newRoomCode}`);
    });
  }

  const handleJoinRoom = () => {
    if (roomCode.trim() === '') {
        return;
    }
    socket.emit('joinRoom', roomCode, (success: boolean) => {
        if (success) {
            setCurrentRoom(roomCode);
            console.log(`Joined room: ${roomCode}`);
        } else {
            console.log(`Failed to join room: ${roomCode}`);
        }
    });
  }

  useEffect(() => {
      const handleNewMessage = (message: MessageType) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        };
        
        const handleTyping = () => {
            setTyping(true)
            setTimeout(()=>{
                setTyping(false)
            }, ANIMATION_DURATION)
        };

    socket.on('message', handleNewMessage);
    socket.on('typing', handleTyping)
        
    // Cleanup event listener on component unmount
    return () => {
      socket.off('message', handleNewMessage);
    };
  }, []);

  const sendMessage = () => {
    if (currentRoom && message.trim()) {
      setLoading(true)
      socket.emit('sendMessage', currentRoom, message);
      setMessage('');
      setTimeout(() => {
        setLoading(false)
      }, ANIMATION_DURATION)
    } else {
      console.log('You are not in a room or message is empty!');
    }
  };

  const updateMaxMessages = () => {
    const height = window.innerHeight;
    setMaxMessages(Math.floor((height-200) / 30));
  }

  useEffect(() => {
    updateMaxMessages();
    window.addEventListener('resize', updateMaxMessages);
    return () => {
      window.removeEventListener('resize', updateMaxMessages);
    }
  }, []);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      socket.emit('typing', currentRoom? currentRoom: '');      
    } else {
      sendMessage();
    } 
  };
  
  const transitions = useTransition(messages.slice(-maxMessages), {
    from: { transform: 'translateX(-100%)', opacity: 0 },
    enter: { transform: 'translateX(0%)', opacity: 1 },
    leave: { opacity: 0 },
  });


  return (
    !currentRoom ? (
      <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Real-Time Chat</h1>
      <div className="messages flex flex-col w-full bg-white shadow-md rounded-lg p-4 mb-4 overflow-y-auto"
      style = {{
          height: `calc(100vh - 100px)`,
          maxWidth: `calc(100vw - 200px)`
      }}
      >
        <div style={{ marginBottom: '20px' }} className="flex flex-col gap-4 items-center justify-center align-middle h-full">
        <h2 className="text-xl font-bold mb-4">Create or join a room to start chatting!</h2>
          <button onClick={handleCreateRoom}
            className="bg-blue-500 w-1/3 text-white p-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Room
          </button>
          OR
          <MultiInput code={roomCode} onChange={(newCode: string) => setRoomCode(newCode)} />
          <button onClick={handleJoinRoom}
            className="bg-blue-500 w-1/3 text-white p-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >Join Room</button>
        </div>
      </div>
      </div>
    ) : (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Room: {currentRoom || 'None'}</h1>
      <div className="messages w-full bg-white shadow-md rounded-lg p-4 mb-4 overflow-y-auto"
      style = {{
          height: `calc(100vh - 100px)`,
          maxWidth: `calc(100vw - 200px)`
      }}
      >
    <Canvas style={{
        top: '-15px',
    height: '10px',
    width: '100%',
    }}>
    {loading && <LoadingScene />}
    {typing && <TypingScene />}
    </Canvas>
        {transitions((style, message) => (
          <animated.div style={style}>
            <Message username={message.sender} text={message.message} color={message.color} />
          </animated.div>
        ))}
      </div>
      <div className="input-box w-full flex" style={{
        maxWidth: `calc(100vw - 200px)`
      }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-4 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
    )
  );
};

export default App;
