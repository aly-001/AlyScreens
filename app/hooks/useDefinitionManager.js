import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { WEBSOCKET_URL, API_KEY } from '../config/constants';

export default function useDefinitionManager() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [currentDefinition, setCurrentDefinition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket(WEBSOCKET_URL);
    socket.onopen = () => {
      console.log('WebSocket connected');
      setWs(socket);
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'start':
          setIsLoading(true);
          break;
        case 'content':
          setCurrentDefinition((prev) => prev + message.data);
          setIsLoading(false);
          break;
        case 'done':
          setIsLoading(false);
          break;
        case 'error':
          console.error('Error from server:', message.error);
          Alert.alert('Error', 'Unable to fetch definition. Please try again.');
          setIsLoading(false);
          break;
      }
    };
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsLoading(false);
    };
    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
    };
  }, []);

  const handleWebViewMessage = async (message) => {
    setCurrentDefinition('');
    const cleanWord = message.word.replace(/^[^\w]+|[^\w]+$/g, '');
    const capitalizedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    setCurrentWord(capitalizedWord);
    const { innerContext, outerContext } = message;
  
    setPopupVisible(true);
    setIsLoading(true);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        word: capitalizedWord,
        innerContext,
        outerContext,
        apiKey: API_KEY
      }));
    } else {
      Alert.alert('Error', 'WebSocket is not connected. Please try again.');
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setIsLoading(false);
    setCurrentDefinition('');
  };

  return {
    popupVisible,
    currentWord,
    currentDefinition,
    isLoading,
    handleWebViewMessage,
    handleClosePopup
  };
}