import { Canvas } from '@react-three/fiber';
import { LoadingScene, TypingScene } from './Anims';
import MessageList from './MessageList';
import { FaPaperPlane } from 'react-icons/fa';

const ChatRoom = ({ currentRoom, messages, typing, loading, maxMessages, message, setMessage, onSendMessage, onTyping, participants }: any) => (
    <>
    <div className="absolute flex justify-between w-full px-24 my-8">
        <div><h1 className="text-4xl font-bold">ROOM <span className="p-1 rounded-sm ml-1 bg-gray-200 border border-gray-300">{currentRoom}</span></h1></div>
        <div className="text-4xl font-bold"> {
            participants?.participants?.map((participant: any) => (
                <span className="
                p-1 text-sm rounded-sm ml-1 bg-gray-200 border border-gray-300
                " key={participant.id} style={{ color: participant.color }}>{participant.nickname}</span>
            ))    
        }</div>
    </div>
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 pt-20">
    <div className="messages w-full bg-white shadow-md rounded-lg p-4 mb-4 overflow-y-auto"
    style = {{
        height: `calc(100vh - 200px)`,
        maxWidth: `calc(100vw - 200px)`
    }}
    >
    <Canvas style={{top: '-15px', height: '10px', width: '100%',}}>
    {loading ? <LoadingScene /> : typing && <TypingScene />}
    </Canvas>
    <MessageList messages={messages} maxMessages={maxMessages} />
    </div>
    <div className="input-box w-full flex" style={{
    maxWidth: `calc(100vw - 200px)`
    }}>
    <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => (e.key === 'Enter' ? onSendMessage() : onTyping())}
        placeholder="Type your message..."
        className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
        onClick={onSendMessage}
        className="bg-blue-500 text-white p-4 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
    >
        <FaPaperPlane />
    </button>
    </div>
    </div>
    </>
);

export default ChatRoom;
