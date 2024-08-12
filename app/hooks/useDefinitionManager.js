import { useState } from "react";
import { Alert } from "react-native";
import { callLLM, generateAudio } from "../services/LLMManager";
import { useSettingsContext } from "../context/useSettingsContext";
import { useAPIKey } from "../context/APIKeyContext";

export default function useDefinitionManager() {
  const { apiKey } = useAPIKey();
  const settings = useSettingsContext().settings;
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [currentDefinition, setCurrentDefinition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [added, setAdded] = useState(true);

  const [grammarStarted, setGrammarStarted] = useState(false);
  const [grammarLoading, setGrammarLoading] = useState(false);
  const [grammarFinished, setGrammarFinished] = useState(false);
  const [currentGrammar, setCurrentGrammar] = useState("");

  const [moduleALoading, setModuleALoading] = useState(false);
  const [currentModuleA, setCurrentModuleA] = useState("");

  const [moduleBLoading, setModuleBLoading] = useState(false);
  const [currentModuleB, setCurrentModuleB] = useState("");

  const [audioBase64, setAudioBase64] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const handleWebViewMessageDefinition = async (message) => {
    setGrammarFinished(false);
    setGrammarStarted(false);
    setGrammarLoading(false);
    setAdded(true);
    setCurrentDefinition("");
    setFinished(false);
    setAudioBase64(null);
    setCurrentGrammar("");
    setAudioLoading(false);
    
    const cleanWord = message.word.replace(/^[^\w]+|[^\w]+$/g, "");
    const capitalizedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    setCurrentWord(capitalizedWord);
    const { innerContext, outerContext } = message;

    setPopupVisible(true);
    setIsLoading(true);

    // Create an array to hold all the promises
    const promises = [];

    // Start the LLM request for the definition
    const definitionPrompt = `Give a translation of the word "${capitalizedWord}" in the context of "${innerContext}" and "${outerContext}". ${settings.translationPrompt}`;
    
    const definitionPromise = callLLM(apiKey, definitionPrompt)
      .then((definitionResponse) => {
        setCurrentDefinition(definitionResponse);
        setFinished(true);
      })
      .catch((error) => {
        console.error("Error fetching definition:", error);
        Alert.alert("Error", "Unable to fetch definition. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
    promises.push(definitionPromise);

    // Start the parallel grammar LLM request only if translationPopupGrammar is true
    if (settings.translationPopupGrammar) {
      setGrammarStarted(true);
      setGrammarLoading(true);
      const grammarPrompt = `Give a grammar explanation of the word "${capitalizedWord}" in the context of "${innerContext}" and "${outerContext}". ${settings.grammarPrompt}`;
      const grammarPromise = callLLM(apiKey, grammarPrompt)
        .then((grammarResponse) => {
          setCurrentGrammar(grammarResponse);
          setGrammarFinished(true);
        })
        .catch((error) => {
          console.error("Error fetching grammar explanation:", error);
          Alert.alert("Error", "Unable to fetch grammar explanation. Please try again.");
        })
        .finally(() => {
          setGrammarLoading(false);
        });
      promises.push(grammarPromise);
    }

    // Generate audio if enabled in settings
    if (settings.translationPopupAudio) {
      setAudioLoading(true);
      const audioPromise = generateAudio(apiKey, capitalizedWord)
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

    // Start the parallel LLM request for ModuleA if enabled
    if (settings.translationPopupModuleA) {
      setModuleALoading(true);
      const moduleAPrompt = `Use "${capitalizedWord}" in the context of "${innerContext}" and "${outerContext}". ${settings.moduleAPrompt}`;
      const moduleAPromise = callLLM(apiKey, moduleAPrompt)
        .then((moduleAResponse) => {
          setCurrentModuleA(moduleAResponse);
        })
        .catch((error) => {
          console.error("Error fetching moduleA explanation:", error);
          Alert.alert("Error", "Unable to fetch moduleA explanation. Please try again.");
        })
        .finally(() => {
          setModuleALoading(false);
        });
      promises.push(moduleAPromise);
    }

    // Start the parallel LLM request for ModuleB if enabled
    if (settings.translationPopupModuleB) {
      setModuleBLoading(true);
      const moduleBPrompt = `Use "${capitalizedWord}" in the context of "${innerContext}" and "${outerContext}". ${settings.moduleBPrompt}`;
      const moduleBPromise = callLLM(apiKey, moduleBPrompt)
        .then((moduleBResponse) => {
          setCurrentModuleB(moduleBResponse);
        })
        .catch((error) => {
          console.error("Error fetching moduleB explanation:", error);
          Alert.alert("Error", "Unable to fetch moduleB explanation. Please try again.");
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
    setAudioBase64(null);
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