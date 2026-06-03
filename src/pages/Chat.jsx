import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getMessages, sendMessage, deleteMessage } from '../utils/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { FiSend, FiTrash2, FiSmile } from 'react-icons/fi';

const emojis = ['👍','❤️','😊','😂','🙏','👌','🔥','✅','⚠️','🛒','🥛','🍅','🥚','🧅','🍚'];

const Chat = () => {
  const { user }  = useAuth();
  const { t }     = useLanguage();

  const [messages,  setMessages]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [input,     setInput]     = useState('');
  const [sending,   setSending]   = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef             = useRef(null);
  const socketRef                  = useRef(null);

  useEffect(() => {
    fetchMessages();
    connectSocket();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectSocket = () => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'https://smarthome-backend.onrender.com');
    if (user?.householdId) {
      socketRef.current.emit('join-household', user.householdId);
    }
    socketRef.current.on('new-message', (data) => {
      setMessages(prev => [...prev, data.message]);
    });
    socketRef.current.on('message-deleted', (data) => {
      setMessages(prev => prev.filter(m => m._id !== data.messageId));
    });
  };

  const fetchMessages = async () => {
    try {
      const { data } = await getMessages();
      setMessages(data);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      await sendMessage({ message: input.trim() });
      setInput('');
      setShowEmoji(false);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      toast.success('Message deleted');
    } catch {
      toast.error('Cannot delete others messages');
    }
  };

  const handleEmoji = (emoji) => {
    setInput(prev => prev + emoji);
    setShowEmoji(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isMyMessage = (msg) => {
    return msg.sender?._id === user?._id ||
           msg.sender === user?._id;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <span className="text-white text-lg">💬</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Household Chat
            </h1>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Live chat with your household members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 px-1 mb-4">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">💬</span>
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              No messages yet. Start chatting with your household! 👋
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.02 }}
                className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isMyMessage(msg) ? 'items-end' : 'items-start'} flex flex-col`}>

                  {/* Sender name */}
                  {!isMyMessage(msg) && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-2">
                      {msg.sender?.name}
                    </span>
                  )}

                  <div className={`flex items-end gap-2 ${isMyMessage(msg) ? 'flex-row-reverse' : 'flex-row'}`}>

                    {/* Avatar */}
                    {!isMyMessage(msg) && (
                      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">
                          {msg.sender?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div className={`relative group px-4 py-2.5 rounded-2xl shadow-sm ${
                      isMyMessage(msg)
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-bl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        isMyMessage(msg)
                          ? 'text-purple-200'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                          hour:   '2-digit',
                          minute: '2-digit'
                        })}
                      </p>

                      {/* Delete button */}
                      {isMyMessage(msg) && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          onClick={() => handleDelete(msg._id)}
                          className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <FiTrash2 size={10} />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-800 mb-2"
          >
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEmoji(emoji)}
                  className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-800">
        <div className="flex items-end gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmoji(!showEmoji)}
            className={`p-2.5 rounded-xl transition-colors ${
              showEmoji
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiSmile size={20} />
          </motion.button>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg disabled:opacity-50"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiSend size={20} />
            )}
          </motion.button>
        </div>
      </div>

    </div>
  );
};

export default Chat;