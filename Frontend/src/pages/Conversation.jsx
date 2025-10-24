import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

export default function Conversation({ messages, currentUser, selectedChat, handleSendMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !fileInputRef.current?.files?.[0]) return;
    
    setIsSubmitting(true);
    try {
      // Create FormData if there's an image
      const formData = new FormData();
      if (fileInputRef.current?.files?.[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }
      formData.append('content', newMessage.trim());
      
      await handleSendMessage(formData);
      setNewMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser._id;
            
            return (
              <div
                key={message._id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-end space-x-2 max-w-[70%]">
                  {/* Profile Picture (only show for received messages) */}
                  {!isOwnMessage && (
                    <img
                      src={selectedChat.participant.profilePicture || '/default-avatar.png'}
                      alt="Profile"
                      className="w-6 h-6 rounded-full object-cover mb-1"
                    />
                  )}
                  
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {/* Message Content */}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Shared"
                        className="max-w-sm rounded-lg mb-2"
                        onLoad={scrollToBottom}
                      />
                    )}
                    {message.content && (
                      <p className="whitespace-pre-wrap break-words text-[15px]">
                        {message.content}
                      </p>
                    )}
                    
                    {/* Timestamp */}
                    <p className={`text-[11px] mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {format(new Date(message.createdAt), 'HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-end space-x-2">
            {/* Image Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={() => {
                if (fileInputRef.current?.files?.[0]) {
                  handleSubmit({ preventDefault: () => {} });
                }
              }}
            />
            
            {/* Message Input */}
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message..."
              className="flex-1 resize-none border border-gray-300 rounded-2xl px-4 py-2 max-h-32 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={1}
              style={{
                minHeight: '40px',
                height: 'auto'
              }}
            />
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={isSubmitting || (!newMessage.trim() && !fileInputRef.current?.files?.[0])}
              className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Conversation.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      content: PropTypes.string,
      image: PropTypes.string,
      senderId: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  selectedChat: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    participant: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      profilePicture: PropTypes.string,
    }).isRequired,
  }).isRequired,
  handleSendMessage: PropTypes.func.isRequired,
};