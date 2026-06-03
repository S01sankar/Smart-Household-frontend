import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const useSocket = () => {
  const { user }    = useAuth();
  const socketRef   = useRef(null);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance  = new SpeechSynthesisUtterance(text);
      utterance.lang   = 'en-IN';
      utterance.rate   = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    // Connect to socket
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'https://smarthome-backend.onrender.com', {
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    // Join household room
    if (user.householdId) {
      socket.emit('join-household', user.householdId);
    }

    // Listen for grocery events
    socket.on('grocery-added', (data) => {
      toast.success(`🛒 ${data.message}`, { duration: 4000 });
    });

    socket.on('low-stock', (data) => {
      toast.error(`⚠️ ${data.message}`, { duration: 5000 });
      speak(data.message);
    });

    // Listen for expense events
    socket.on('expense-added', (data) => {
      toast.success(`💰 ${data.message}`, { duration: 4000 });
    });

    socket.on('budget-exceeded', (data) => {
      toast.error(`🚨 ${data.message}`, {
        duration: 6000,
        style: {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: '#fff',
        }
      });
      speak(data.message);
    });

    // Listen for task events
    socket.on('task-added', (data) => {
      toast.success(`✅ ${data.message}`, { duration: 4000 });
      speak(`New task assigned: ${data.task?.title}`);
    });

    socket.on('task-updated', (data) => {
      toast.success(`✅ ${data.message}`, { duration: 4000 });
    });

    // Listen for bill events
    socket.on('bill-added', (data) => {
      toast.success(`📋 ${data.message}`, { duration: 4000 });
    });

    socket.on('bill-paid', (data) => {
      toast.success(`💚 ${data.message}`, { duration: 4000 });
    });

    // Listen for member events
    socket.on('member-joined', (data) => {
      toast.success(`👤 ${data.message}`, { duration: 4000 });
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return socketRef.current;
};

export default useSocket;