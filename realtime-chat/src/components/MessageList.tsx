import React from 'react';
import { useTransition, animated } from '@react-spring/web';
import Message from './Message';

interface MessageType {
  sender: string;
  color: string;
  message: string;
}

interface MessageListProps {
  messages: MessageType[];
  maxMessages: number;
}

const MessageList: React.FC<MessageListProps> = ({ messages, maxMessages }) => {
  const transitions = useTransition(messages.slice(-maxMessages), {
    from: { transform: 'translateX(-100%)', opacity: 0 },
    enter: { transform: 'translateX(0%)', opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <>
      {transitions((style, message) => (
        <animated.div style={style}>
          <Message username={message.sender} text={message.message} color={message.color} />
        </animated.div>
      ))}
    </>
  );
};

export default MessageList;
