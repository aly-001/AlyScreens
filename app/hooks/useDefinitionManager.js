import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { WEBSOCKET_URL, API_KEY } from "../config/constants";
import { callLLM, generateAudio } from "../services/LLMManager";
import { useSettingsContext } from "../context/useSettingsContext";

export default function useDefinitionManager() {
  const settings = useSettingsContext().settings;
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [currentDefinition, setCurrentDefinition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [ws, setWs] = useState(null);
  const [added, setAdded] = useState(true);

  const [grammarStarted, setGrammarStarted] = useState(false);
  const [grammarLoading, setGrammarLoading] = useState(false);
  const [grammarFinished, setGrammarFinished] = useState(false);
  const [currentGrammar, setCurrentGrammar] = useState("");

  const [moduleAStarted, setModuleAStarted] = useState(false);
  const [moduleALoading, setModuleALoading] = useState(false);
  const [currentModuleA, setCurrentModuleA] = useState("");

  const [moduleBStarted, setModuleBStarted] = useState(false);
  const [moduleBLoading, setModuleBLoading] = useState(false);
  const [currentModuleB, setCurrentModuleB] = useState("");

  const [audioData, setAudioData] = useState(null);
  const [audioBase64, setAudioBase64] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

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
      console.log("WebSocket connected");
      setWs(socket);
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "start":
          setIsLoading(true);
          break;
        case "content":
          setStarted(false);
          setCurrentDefinition((prev) => prev + message.data);
          setIsLoading(false);
          break;
        case "done":
          console.log("Finished");
          setIsLoading(false);
          setFinished(true);
          break;
        case "error":
          console.error("Error from server:", message.error);
          Alert.alert("Error", "Unable to fetch definition. Please try again.");
          setIsLoading(false);
          break;
      }
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsLoading(false);
    };
    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setWs(null);
    };
  }, []);

  const handleWebViewMessageDefinition = async (message) => {
    setGrammarFinished(false);
    setGrammarStarted(false);
    setGrammarLoading(false);
    setAdded(true);
    setCurrentDefinition("");
    setFinished(false);
    setStarted(true);
    setAudioData(null);
    setCurrentGrammar("");
    setAudioLoading(false);
    console.log("Started");
    const cleanWord = message.word.replace(/^[^\w]+|[^\w]+$/g, "");
    const capitalizedWord =
      cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    setCurrentWord(capitalizedWord);
    const { innerContext, outerContext } = message;

    setPopupVisible(true);
    setIsLoading(true);

    // Create an array to hold all the promises
    const promises = [];

    // Start the WebSocket request for the definition
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          word: capitalizedWord,
          innerContext,
          outerContext,
          apiKey: API_KEY,
        })
      );
    } else {
      Alert.alert("Error", "WebSocket is not connected. Please try again.");
      setIsLoading(false);
    }

    // Start the parallel grammar LLM request only if translationPopupGrammar is true
    if (settings.translationPopupGrammar) {
      setGrammarStarted(true);
      setGrammarLoading(true);
      const grammarPrompt = `Give a grammar explanation of the word "${capitalizedWord}" in the context of "${innerContext}" and "${outerContext}". ${settings.grammarPrompt}`;
      const grammarPromise = callLLM(grammarPrompt)
        .then((grammarResponse) => {
          setCurrentGrammar(grammarResponse);
          setGrammarFinished(true);
        })
        .catch((error) => {
          console.error("Error fetching grammar explanation:", error);
          Alert.alert(
            "Error",
            "Unable to fetch grammar explanation. Please try again."
          );
        })
        .finally(() => {
          setGrammarLoading(false);
        });
      promises.push(grammarPromise);
    }

    // Generate audio if enabled in settings
    if (settings.translationPopupAudio) {
      setAudioLoading(true);
      const audioPromise = generateAudio(capitalizedWord)
        .then((audio) => {
          setAudioBase64(audio);
        })
        .catch((error) => {
          console.error("Error generating audio:", error);
          Alert.alert("Error", "Unable to generate audio. Please try again.");
        })
        .finally(() => {
          setAudioLoading(false);
        });
      promises.push(audioPromise);
    }

    // Start the parallel grammar LLM request only if translationPopupGrammar is true
    if (settings.translationPopupModuleA) {
      setModuleALoading(true);
      const moduleAPrompt = `Use "${capitalizedWord}" in the context of "${innerContext}" and "${outerContext}". ${settings.moduleAPrompt}`;
      const moduleAPromise = callLLM(moduleAPrompt)
        .then((moduleAResponse) => {
          setCurrentModuleA(moduleAResponse);
        })
        .catch((error) => {
          console.error("Error fetching moduleA explanation:", error);
          Alert.alert(
            "Error",
            "Unable to fetch moduleA explanation. Please try again."
          );
        })
        .finally(() => {
          setModuleALoading(false);
        });
      promises.push(moduleAPromise);
    }

    // Start the parallel grammar LLM request only if translationPopupGrammar is true
    if (settings.translationPopupModuleB) {
      setModuleBLoading(true);
      const moduleBPrompt = `Use "${capitalizedWord}" in the context of "${innerContext}" and "${outerContext}". ${settings.moduleBPrompt}`;
      const moduleBPromise = callLLM(moduleBPrompt)
        .then((moduleBResponse) => {
          setCurrentModuleB(moduleBResponse);
        })
        .catch((error) => {
          console.error("Error fetching moduleB explanation:", error);
          Alert.alert(
            "Error",
            "Unable to fetch moduleB explanation. Please try again."
          );
        })
        .finally(() => {
          setModuleBLoading(false);
        });
      promises.push(moduleBPromise);
    }

    // Wait for all promises to resolve
    await Promise.all(promises);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setIsLoading(false);
    setCurrentDefinition("");
    setCurrentGrammar("");
    setGrammarFinished(false);
    setGrammarStarted(false);
    setAudioData(null);
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
    moduleALoading,
    currentModuleA,
    moduleBLoading,
    currentModuleB,
    audioBase64,
    audioLoading,
    handleWebViewMessageDefinition,
    handleClosePopup,
    handleToggle,
  };
}
