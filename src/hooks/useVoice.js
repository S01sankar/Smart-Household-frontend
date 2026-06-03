import { useState, useEffect, useCallback } from 'react';
import { addGrocery } from '../utils/api';
import toast from 'react-hot-toast';

const useVoice = () => {
  const [listening,   setListening]   = useState(false);
  const [transcript,  setTranscript]  = useState('');
  const [supported,   setSupported]   = useState(false);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSupported(true);
    }
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang  = 'en-IN';
      utterance.rate  = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processCommand = useCallback(async (command) => {
    const cmd = command.toLowerCase().trim();
    console.log('Voice command:', cmd);

    // Add grocery commands
    if (cmd.includes('add')) {
      const items = [
        'milk', 'rice', 'tomato', 'onion', 'potato',
        'egg', 'oil', 'sugar', 'salt', 'bread',
        'butter', 'curd', 'dal', 'flour', 'water'
      ];

      for (const item of items) {
        if (cmd.includes(item)) {
          try {
            await addGrocery({
              name:     item.charAt(0).toUpperCase() + item.slice(1),
              category: 'other',
              quantity: 1,
              unit:     'units',
              price:    0,
            });
            toast.success(`✅ ${item} added!`);
            speak(`${item} has been added to your grocery list`);
            return;
          } catch {
            toast.error('Failed to add item');
            speak('Sorry, failed to add item');
          }
        }
      }
      toast.error('Item not recognized');
      speak('Sorry, I did not understand the item name');
      return;
    }

    // Navigation commands
    if (cmd.includes('go to groceries') || cmd.includes('open groceries')) {
      speak('Opening groceries');
      window.location.href = '/groceries';
      return;
    }

    if (cmd.includes('go to expenses') || cmd.includes('open expenses')) {
      speak('Opening expenses');
      window.location.href = '/expenses';
      return;
    }

    if (cmd.includes('go to tasks') || cmd.includes('open tasks')) {
      speak('Opening tasks');
      window.location.href = '/tasks';
      return;
    }

    if (cmd.includes('go to dashboard') || cmd.includes('open dashboard')) {
      speak('Opening dashboard');
      window.location.href = '/dashboard';
      return;
    }

    // Stock check commands
    if (cmd.includes('what is missing') || cmd.includes('low stock')) {
      speak('Please check your dashboard for low stock items');
      toast.success('Check dashboard for low stock items');
      return;
    }

    speak('Sorry, I did not understand that command');
    toast.error('Command not recognized. Try "Add milk" or "Go to groceries"');
  }, []);

  const startListening = useCallback(() => {
    if (!supported) {
      toast.error('Voice not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition       = new SpeechRecognition();

    recognition.lang          = 'en-IN';
    recognition.continuous    = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      toast.success('🎤 Listening...');
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      processCommand(result);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setListening(false);
      toast.error('Voice recognition error. Try again.');
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }, [supported, processCommand]);

  const stopListening = useCallback(() => {
    setListening(false);
  }, []);

  return {
    listening,
    transcript,
    supported,
    startListening,
    stopListening,
    speak
  };
};

export default useVoice;