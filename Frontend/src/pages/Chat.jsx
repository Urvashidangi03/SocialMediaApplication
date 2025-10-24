import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { format } from 'date-fns';

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentChat, setCurrentChat] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { chatId } = useParams();

  // Connect to Socket.io
  useEffect(() => {
    socketRef.current = io();
    
    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/chats');
        setChats(response.data);
        console.log('Fetched chats:', response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChats();
  }, []);

  // Fetch messages when chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        try {
          const response = await axios.get(`/api/messages/${chatId}`);
          setMessages(response.data);
          setCurrentChat(chats.find(chat => chat._id === chatId));
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };
    fetchMessages();
  }, [chatId, chats]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    try {
      const response = await axios.post('/api/messages', {
        chatId: currentChat._id,
        content: newMessage
      });
      
      // Emit message through socket
      socketRef.current?.emit('message', response.data);
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 ${
        isSidebarOpen ? 'w-80' : 'w-0 -ml-80'
      } transition-all duration-300 flex-shrink-0 md:w-80 md:ml-0`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chats</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setCurrentChat(chat)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                currentChat?._id === chat._id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={chat.participants[0]?.profilePicture || '/default-avatar.png'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{chat.participants[0]?.username}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage?.content || 'No messages yet'}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {currentChat ? (
            <div className="flex items-center">
              <img
                src={currentChat.participants[0]?.profilePicture || '/default-avatar.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <h2 className="text-lg font-semibold">
                {currentChat.participants[0]?.username}
              </h2>
            </div>
          ) : (
            <h2 className="text-lg font-semibold">Select a chat to start messaging</h2>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex mb-4 ${
                message.sender === currentChat?.participants[0]?._id
                  ? 'justify-start'
                  : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  message.sender === currentChat?.participants[0]?._id
                    ? 'bg-white'
                    : 'bg-blue-500 text-white'
                } rounded-lg p-3 shadow-sm`}
              >
                <p className="break-words">{message.content}</p>
                <p className="text-xs mt-1 opacity-75">
                  {format(new Date(message.createdAt), 'HH:mm')}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {currentChat && (
          <form onSubmit={sendMessage} className="bg-white border-t border-gray-200 p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}