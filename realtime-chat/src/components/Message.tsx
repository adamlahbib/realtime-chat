import React from 'react';

type MessageProps = {
  username: string;
  text: string;
  color: string;
};

const Message: React.FC<MessageProps> = ({ username, text, color }) => {
  return (
    <div className="message mb-2">
      <strong style={{ color: color }}>: {username}</strong> <span className="text-gray-700">{text}</span>
    </div>
  );
};

export default Message;