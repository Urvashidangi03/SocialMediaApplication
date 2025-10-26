// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';

// const Chat = () => {
//   const [conversations, setConversations] = useState([]);
//   const [activeChat, setActiveChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [onlineUsers, setOnlineUsers] = useState(new Set());
//   const messagesEndRef = useRef(null);
//   const socket = useRef(null);
//   const navigate = useNavigate();

//   // Demo conversations (replace with actual data from your backend)
//   const demoConversations = [
//     {
//       id: 1,
//       user: { id: 1, name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
//       lastMessage: 'Hey, how are you doing?',
//       timestamp: '10:30 AM'
//     },
//     {
//       id: 2,
//       user: { id: 2, name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=5' },
//       lastMessage: 'The project looks great! 🎉',
//       timestamp: 'Yesterday'
//     },
//     {
//       id: 3,
//       user: { id: 3, name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=8' },
//       lastMessage: 'Did you see the latest updates?',
//       timestamp: '2 days ago'
//     }
//   ];

//   useEffect(() => {
//     setConversations(demoConversations);
    
//     socket.current = io('http://localhost:3000', {
//     withCredentials: true,
//     });
    
//     socket.current.on('message', handleNewMessage);
//     socket.current.on('userOnline', handleUserOnline);
//     socket.current.on('userOffline', handleUserOffline);

//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//       }
//     };
//   }, []);

//   const handleNewMessage = (msg) => {
//     setMessages(prev => [...prev, msg]);
//     scrollToBottom();
//   };

//   const handleUserOnline = (userId) => {
//     setOnlineUsers(prev => new Set([...prev, userId]));
//   };

//   const handleUserOffline = (userId) => {
//     setOnlineUsers(prev => {
//       const newSet = new Set(prev);
//       newSet.delete(userId);
//       return newSet;
//     });
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     const newMessage = {
//       id: Date.now(),
//       text: message,
//       sender: 'me',
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };

//     socket.current.emit('send-message', {
//       text: message,
//       recipientId: activeChat?.user.id
//     });

//     setMessages(prev => [...prev, newMessage]);
//     setMessage('');
//     scrollToBottom();
//   };

//   return (
//     <div className="container grid h-[calc(100vh-64px)]" style={{ maxWidth: '1200px' }}>
//       <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-0 bg-card rounded-lg border border-border overflow-hidden">
//         {/* Conversations List */}
//         <div className="border-r border-border overflow-y-auto">
//           <div className="p-4 border-b border-border">
//             <h2 className="text-xl font-semibold text-text">Messages</h2>
//           </div>
//           <div className="divide-y divide-border">
//             {conversations.map(conv => (
//               <div
//                 key={conv.id}
//                 onClick={() => setActiveChat(conv)}
//                 className={`p-4 hover:bg-bg cursor-pointer transition-colors ${
//                   activeChat?.id === conv.id ? 'bg-bg/50' : ''
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <img
//                       src={conv.user.avatar}
//                       alt={conv.user.name}
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                     {onlineUsers.has(conv.user.id) && (
//                       <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card"></span>
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-baseline">
//                       <h3 className="font-medium text-text truncate">{conv.user.name}</h3>
//                       <span className="text-xs text-muted whitespace-nowrap ml-2">{conv.timestamp}</span>
//                     </div>
//                     <p className="text-sm text-muted truncate">{conv.lastMessage}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex flex-col bg-bg">
//           {activeChat ? (
//             <>
//               {/* Chat Header */}
//               <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
//                 <img
//                   src={activeChat.user.avatar}
//                   alt={activeChat.user.name}
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//                 <div>
//                   <h3 className="font-medium text-text">{activeChat.user.name}</h3>
//                   <span className="text-sm text-muted">
//                     {onlineUsers.has(activeChat.user.id) ? 'Online' : 'Offline'}
//                   </span>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                 {messages.map(msg => (
//                   <div
//                     key={msg.id}
//                     className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`max-w-[70%] rounded-lg p-3 ${
//                         msg.sender === 'me'
//                           ? 'bg-primary text-white ml-8 rounded-br-sm'
//                           : 'bg-card border border-border mr-8 rounded-bl-sm'
//                       }`}
//                     >
//                       <p className="text-sm">{msg.text}</p>
//                       <span
//                         className={`text-xs ${
//                           msg.sender === 'me' ? 'text-white/70' : 'text-muted'
//                         } block mt-1`}
//                       >
//                         {msg.timestamp}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Message Input */}
//               <form onSubmit={sendMessage} className="p-4 border-t border-border bg-card">
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 bg-bg rounded-lg border border-border px-4 py-2 text-text placeholder:text-muted focus:outline-none focus:border-primary"
//                   />
//                   <button
//                     type="submit"
//                     className="bg-primary text-button-text rounded-lg px-6 py-2 hover:bg-opacity-90 transition-colors"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </form>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center text-muted p-4">
//                 <svg
//                   className="mx-auto h-10 w-10 text-muted"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={1.5}
//                     d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//                   />
//                 </svg>
//                 <h3 className="mt-2 text-sm font-medium text-text">No chat selected</h3>
//                 <p className="mt-1 text-sm">
//                   Choose a conversation from the list to start chatting
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

// import React, { useState, useEffect, useRef } from 'react';

// // Simple Chat component (single-file).
// // Usage: import Chat from './Chat.jsx'; then <Chat /> in your app.

// export default function Chat() {
//   const [messages, setMessages] = useState([
//     { id: 1, from: 'them', text: 'Hey! This is a simple chat demo.' },
//     { id: 2, from: 'me', text: "Hi — looks neat! What's next?" },
//   ]);
//   const [input, setInput] = useState('');
//   const [sending, setSending] = useState(false);
//   const listRef = useRef(null);

//   useEffect(() => {
//     ensureStyles();
//   }, []);

//   useEffect(() => {
//     // scroll to bottom whenever messages change
//     if (listRef.current) {
//       listRef.current.scrollTop = listRef.current.scrollHeight;
//     }
//   }, [messages]);

//   function ensureStyles() {
//     const id = 'chat-component-simple-styles';
//     if (document.getElementById(id)) return;
//     const css = `
//       .chat-wrapper { max-width: 720px; margin: 16px auto; border: 1px solid #e6e6e6; border-radius: 10px; overflow: hidden; font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
//       .chat-header { padding: 12px 16px; background: #fafafa; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 12px; }
//       .chat-header .title { font-weight: 600; }
//       .chat-body { height: 420px; overflow: auto; padding: 16px; background: linear-gradient(180deg,#ffffff, #fbfbfb); }
//       .msg { display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-end; }
//       .msg.me { justify-content: flex-end; }
//       .bubble { max-width: 72%; padding: 10px 12px; border-radius: 12px; line-height: 1.3; box-shadow: 0 1px 0 rgba(0,0,0,0.02); }
//       .bubble.them { background: #f3f4f6; color: #111827; border-bottom-left-radius: 4px; }
//       .bubble.me { background: #0369a1; color: white; border-bottom-right-radius: 4px; }
//       .avatar { width: 34px; height: 34px; border-radius: 50%; background: #ddd; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; color: #555; }
//       .chat-input { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #eee; background: white; }
//       .chat-input input[type='text'] { flex: 1; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; font-size: 14px; }
//       .chat-input button { padding: 10px 14px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; background: #0ea5a4; color: white; }
//       .chat-input button:disabled { opacity: 0.6; cursor: default; }
//       .meta { font-size: 12px; color: #6b7280; }
//       @media (max-width: 480px) { .chat-body { height: 300px; } .bubble { max-width: 86%; } }
//     `;
//     const style = document.createElement('style');
//     style.id = id;
//     style.innerHTML = css;
//     document.head.appendChild(style);
//   }

//   function handleSend() {
//     const text = input.trim();
//     if (!text) return;
//     setSending(true);
//     // simulate a small delay like sending to server
//     setTimeout(() => {
//       const id = Date.now();
//       setMessages((m) => [...m, { id, from: 'me', text }]);
//       setInput('');
//       setSending(false);

//       // simulate a reply
//       setTimeout(() => {
//         setMessages((m) => [...m, { id: Date.now() + 1, from: 'them', text: "Nice — got your message!" }]);
//       }, 700);
//     }, 350);
//   }

//   function handleKeyDown(e) {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   }

//   return (
//     <div className="chat-wrapper">
//       <div className="chat-header">
//         <div className="avatar">U</div>
//         <div>
//           <div className="title">Simple Chat</div>
//           <div className="meta">online</div>
//         </div>
//       </div>

//       <div className="chat-body" ref={listRef}>
//         {messages.map((m) => (
//           <div key={m.id} className={`msg ${m.from === 'me' ? 'me' : ''}`}>
//             {m.from === 'them' && <div className="avatar">T</div>}
//             <div className={`bubble ${m.from === 'me' ? 'me' : 'them'}`}>{m.text}</div>
//             {m.from === 'me' && <div style={{ width: 34 }} />}
//           </div>
//         ))}
//       </div>

//       <div className="chat-input">
//         <input
//           type="text"
//           placeholder="Type a message and press Enter"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           aria-label="Message input"
//         />
//         <button onClick={handleSend} disabled={sending || !input.trim()}>{sending ? 'Sending...' : 'Send'}</button>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Chat({ user1, user2 }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    ensureStyles();
  }, []);

  useEffect(() => {
    if (!user1 || !user2) return;
    fetchMessages();
  }, [user1, user2]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  async function fetchMessages() {
    try {
      const res = await axios.get(
        `http://localhost:3000/chat-history/${user1}/${user2}?limit=50&skip=0`
      );
      setMessages(res.data.chatHistory.reverse());
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text) return;

    setSending(true);
    try {
      const res = await axios.post('http://localhost:3000/send-message', {
        sender: user1,
        receiver: user2,
        text
      });
      setMessages((m) => [...m, res.data.data]);
      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function ensureStyles() {
    const id = 'chat-component-simple-styles';
    if (document.getElementById(id)) return;
    const css = `
      .chat-wrapper { max-width: 720px; margin: 16px auto; border: 1px solid #e6e6e6; border-radius: 10px; overflow: hidden; font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
      .chat-header { padding: 12px 16px; background: #fafafa; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 12px; }
      .chat-header .title { font-weight: 600; }
      .chat-body { height: 420px; overflow: auto; padding: 16px; background: linear-gradient(180deg,#ffffff, #fbfbfb); }
      .msg { display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-end; }
      .msg.me { justify-content: flex-end; }
      .bubble { max-width: 72%; padding: 10px 12px; border-radius: 12px; line-height: 1.3; box-shadow: 0 1px 0 rgba(0,0,0,0.02); }
      .bubble.them { background: #f3f4f6; color: #111827; border-bottom-left-radius: 4px; }
      .bubble.me { background: #0369a1; color: white; border-bottom-right-radius: 4px; }
      .avatar { width: 34px; height: 34px; border-radius: 50%; background: #ddd; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; color: #555; }
      .chat-input { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #eee; background: white; }
      .chat-input input[type='text'] { flex: 1; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; font-size: 14px; }
      .chat-input button { padding: 10px 14px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; background: #0ea5a4; color: white; }
      .chat-input button:disabled { opacity: 0.6; cursor: default; }
      .meta { font-size: 12px; color: #6b7280; }
      @media (max-width: 480px) { .chat-body { height: 300px; } .bubble { max-width: 86%; } }
    `;
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="avatar">U</div>
        <div>
          <div className="title">Simple Chat</div>
          <div className="meta">online</div>
        </div>
      </div>

      <div className="chat-body" ref={listRef}>
        {messages.map((m) => (
          <div key={m._id} className={`msg ${m.sender === user1 ? 'me' : ''}`}>
            {m.sender !== user1 && <div className="avatar">T</div>}
            <div className={`bubble ${m.sender === user1 ? 'me' : 'them'}`}>{m.text}</div>
            {m.sender === user1 && <div style={{ width: 34 }} />}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message input"
        />
        <button onClick={handleSend} disabled={sending || !input.trim()}>{sending ? 'Sending...' : 'Send'}</button>
      </div>
    </div>
  );
}
