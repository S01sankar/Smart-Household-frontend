import { useState, useEffect, useCallback } from 'react';
import { getNearbyStores, saveLocation } from '../utils/api';
import toast from 'react-hot-toast';

const useLocation = () => {
  const [location,         setLocation]         = useState(null);
  const [nearbyStores,     setNearbyStores]     = useState([]);
  const [veryNearbyStores, setVeryNearbyStores] = useState([]);
  const [shoppingList,     setShoppingList]     = useState([]);
  const [myTasks,          setMyTasks]          = useState([]);
  const [loading,          setLoading]          = useState(false);
  const [supported,        setSupported]        = useState(false);
  const [alertShown,       setAlertShown]       = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      setSupported(true);
    }
  }, []);

  const checkNearbyStores = useCallback(async (latitude, longitude) => {
    try {
      // Save location to backend
      await saveLocation({ latitude, longitude });

      const { data } = await getNearbyStores({ latitude, longitude });
      setNearbyStores(data.nearbyStores);
      setVeryNearbyStores(data.veryNearbyStores || []);
      setShoppingList(data.shoppingList);
      setMyTasks(data.myTasks || []);

      // If user is within 100 meters of a store
      if (data.veryNearbyStores && data.veryNearbyStores.length > 0) {
        const nearest = data.veryNearbyStores[0];

        if (!alertShown) {
          setAlertShown(true);

          // Show toast alert
          toast(
            `📍 You are ${nearest.distance}m from ${nearest.name}!\n` +
            `🛒 ${data.shoppingList.length} items to buy!`,
            {
              duration: 8000,
              style: {
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color:      '#fff',
                border:     'none',
                fontSize:   '14px',
              },
            }
          );

          // Voice alert
          if ('speechSynthesis' in window) {
            const itemNames = data.shoppingList
              .slice(0, 3)
              .map(i => i.name)
              .join(', ');

            const taskNames = data.myTasks
              .slice(0, 2)
              .map(t => t.title)
              .join(', ');

            let msg = `You are ${nearest.distance} meters away from ${nearest.name}.`;

            if (data.shoppingList.length > 0) {
              msg += ` You have ${data.shoppingList.length} items to buy including ${itemNames}.`;
            }

            if (data.myTasks.length > 0) {
              msg += ` You also have pending tasks: ${taskNames}.`;
            }

            const utterance    = new SpeechSynthesisUtterance(msg);
            utterance.lang     = 'en-IN';
            utterance.rate     = 0.9;
            window.speechSynthesis.speak(utterance);
          }

          // Reset alert after 10 minutes
          setTimeout(() => setAlertShown(false), 10 * 60 * 1000);
        }
      } else if (data.nearbyStores && data.nearbyStores.length > 0) {
        const nearest = data.nearbyStores[0];

        if (!alertShown) {
          setAlertShown(true);

          toast(
            `📍 ${nearest.name} is ${nearest.distance}m away!\n` +
            `🛒 ${data.shoppingList.length} items need to be purchased!`,
            {
              duration: 6000,
              style: {
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                color:      '#fff',
                border:     'none',
                fontSize:   '14px',
              },
            }
          );

          setTimeout(() => setAlertShown(false), 10 * 60 * 1000);
        }
      }
    } catch (err) {
      console.error('Nearby stores error:', err);
    }
  }, [alertShown]);

  const getCurrentLocation = useCallback(() => {
    if (!supported) {
      toast.error('Location not supported in this browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        await checkNearbyStores(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        console.error('Location error:', error);
        setLoading(false);
        toast.error('Failed to get location. Please allow location access.');
      },
      {
        enableHighAccuracy: true,
        timeout:            10000,
        maximumAge:         0
      }
    );
  }, [supported, checkNearbyStores]);

  // Auto check location every 2 minutes
  useEffect(() => {
    if (!supported) return;
    getCurrentLocation();
    const interval = setInterval(() => {
      getCurrentLocation();
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [supported]);

  return {
    location,
    nearbyStores,
    veryNearbyStores,
    shoppingList,
    myTasks,
    loading,
    supported,
    getCurrentLocation
  };
};

export default useLocation;