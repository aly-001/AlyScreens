import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { WEBSOCKET_URL, API_KEY } from '../config/constants';
import { callLLM } from '../services/LLMManager';
import { useSettingsContext } from '../context/useSettingsContext';

export default function useDefinitionManager() {
  const settings = useSettingsContext().settings;
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [currentDefinition, setCurrentDefinition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [ws, setWs] = useState(null);
  const [added, setAdded] = useState(true);
  const [grammarStarted, setGrammarStarted] = useState(false);
  const [grammarLoading, setGrammarLoading] = useState(false);
  const [grammarFinished, setGrammarFinished] = useState(false);
  const [currentGrammar, setCurrentGrammar] = useState('');

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
          setStarted(false);
          setCurrentDefinition((prev) => prev + message.data);
          setIsLoading(false);
          break;
        case 'done':
          console.log("Finished");
          setIsLoading(false);
          setFinished(true);
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

  const handleWebViewMessageDefinition = async (message) => {
    setGrammarFinished(false);
    setGrammarStarted(true);
    setGrammarLoading(true);
    setAdded(true);
    setCurrentDefinition('');
    setFinished(false);
    setStarted(true);
    console.log("Started");
    const cleanWord = message.word.replace(/^[^\w]+|[^\w]+$/g, '');
    const capitalizedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    setCurrentWord(capitalizedWord);
    const { innerContext, outerContext } = message;
  
    setPopupVisible(true);
    setIsLoading(true);

    // Start the WebSocket request for the definition
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

    // Start the parallel grammar LLM request
    const grammarPrompt = `Give a grammar explanation of the word "${capitalizedWord}" in the context of "${innerContext}" and "${outerContext}". ${settings.grammarPrompt}`;
    try {
      const grammarResponse = await callLLM(grammarPrompt);
      setCurrentGrammar(grammarResponse);
      setGrammarFinished(true);
    } catch (error) {
      console.error('Error fetching grammar explanation:', error);
      Alert.alert('Error', 'Unable to fetch grammar explanation. Please try again.');
    } finally {
      setGrammarLoading(false);
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setIsLoading(false);
    setCurrentDefinition('');
    setCurrentGrammar('');
    setGrammarFinished(false);
    setGrammarStarted(false);
  };

  const handleToggle = () => {
    console.log("Toggled");
    console.log(added);
    setAdded(!added);
  };

  return {
    popupVisible,
    currentWord,
    currentDefinition,
    isLoading,
    finished,
    started,
    added,
    grammarStarted,
    grammarLoading,
    grammarFinished,
    currentGrammar,
    handleWebViewMessageDefinition,
    handleClosePopup,
    handleToggle,
  };
}