import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const navigate = useNavigate();

  // Demo conversations (replace with actual data from your backend)
  const demoConversations = [
    {
      id: 1,
      user: { id: 1, name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
      lastMessage: 'Hey, how are you doing?',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      user: { id: 2, name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=5' },
      lastMessage: 'The project looks great! 🎉',
      timestamp: 'Yesterday'
    },
    {
      id: 3,
      user: { id: 3, name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=8' },
      lastMessage: 'Did you see the latest updates?',
      timestamp: '2 days ago'
    }
  ];

  useEffect(() => {
    setConversations(demoConversations);
    
    socket.current = io('http://localhost:3000', {
    withCredentials: true,
    transports: ['websocket', 'polling']
    });
    
    socket.current.on('message', handleNewMessage);
    socket.current.on('userOnline', handleUserOnline);
    socket.current.on('userOffline', handleUserOffline);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const handleNewMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
    scrollToBottom();
  };

  const handleUserOnline = (userId) => {
    setOnlineUsers(prev => new Set([...prev, userId]));
  };

  const handleUserOffline = (userId) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socket.current.emit('sendMessage', {
      text: message,
      recipientId: activeChat?.user.id
    });

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    scrollToBottom();
  };

  return (
    <div className="container grid h-[calc(100vh-64px)]" style={{ maxWidth: '1200px' }}>
      <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-0 bg-card rounded-lg border border-border overflow-hidden">
        {/* Conversations List */}
        <div className="border-r border-border overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-text">Messages</h2>
          </div>
          <div className="divide-y divide-border">
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setActiveChat(conv)}
                className={`p-4 hover:bg-bg cursor-pointer transition-colors ${
                  activeChat?.id === conv.id ? 'bg-bg/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={conv.user.avatar}
                      alt={conv.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {onlineUsers.has(conv.user.id) && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium text-text truncate">{conv.user.name}</h3>
                      <span className="text-xs text-muted whitespace-nowrap ml-2">{conv.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col bg-bg">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
                <img
                  src={activeChat.user.avatar}
                  alt={activeChat.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-text">{activeChat.user.name}</h3>
                  <span className="text-sm text-muted">
                    {onlineUsers.has(activeChat.user.id) ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === 'me'
                          ? 'bg-primary text-white ml-8 rounded-br-sm'
                          : 'bg-card border border-border mr-8 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span
                        className={`text-xs ${
                          msg.sender === 'me' ? 'text-white/70' : 'text-muted'
                        } block mt-1`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-bg rounded-lg border border-border px-4 py-2 text-text placeholder:text-muted focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-button-text rounded-lg px-6 py-2 hover:bg-opacity-90 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted p-4">
                <svg
                  className="mx-auto h-10 w-10 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-text">No chat selected</h3>
                <p className="mt-1 text-sm">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
