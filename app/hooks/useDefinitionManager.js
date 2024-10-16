import { useState } from "react";
import { Alert } from "react-native";
import { callLLM, generateAudio } from "../services/LLMManager";
import { useSettingsContext } from "../context/useSettingsContext";
import { useAPIKey } from "../context/APIKeyContext";
import { processWord } from "../services/WordProcessRegex";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function useDefinitionManager() {
  const navigation = useNavigation(); // Initialize navigation
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

  const customErrorAlert = () => {
    setPopupVisible(false);
    Alert.alert(
      "Troubleshooting Steps",
      "• Check your internet connection.\n• Verify your API key.\n• Ensure you have sufficient credits on your API key.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Go to Help", onPress: () => navigateToHelpScreen() } // Updated handler
      ]
    );
  };

  const navigateToHelpScreen = () => {
    navigation.navigate("Help"); // Navigate to the Help screen
  };

  /**
   * Centralized error handler for LLM calls
   */
  const handleLLMError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    customErrorAlert();
  };

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
    
    const processedWord = processWord(message.word);
    setCurrentWord(processedWord);
    const { innerContext, outerContext } = message;

    setPopupVisible(true);
    setIsLoading(true);

    // Create an array to hold all the promises
    const promises = [];

    // Start the LLM request for the definition
    const definitionPrompt = `Give a translation of the word "${processedWord}" in the context of "${innerContext}". ${settings.translationPrompt}`;
    
    const definitionPromise = callLLM(apiKey, definitionPrompt)
      .then((definitionResponse) => {
        if (definitionResponse === null) {
          customErrorAlert(); // Trigger alert if response is null
        } else {
          setCurrentDefinition(definitionResponse);
          setFinished(true);
        }
      })
      .catch((error) => handleLLMError(error, "Definition"))
      .finally(() => {
        setIsLoading(false);
      });
    promises.push(definitionPromise);

    // Start the parallel grammar LLM request only if translationPopupGrammar is true
    if (settings.translationPopupGrammar) {
      setGrammarStarted(true);
      setGrammarLoading(true);
      const grammarPrompt = `Give a grammar explanation of the word "${processedWord}" in the context of "${innerContext}" and "${outerContext}". ${settings.grammarPrompt}`;
      
      const grammarPromise = callLLM(apiKey, grammarPrompt)
        .then((grammarResponse) => {
          if (grammarResponse === null) {
            customErrorAlert(); // Trigger alert if response is null
          } else {
            setCurrentGrammar(grammarResponse);
            setGrammarFinished(true);
          }
        })
        .catch((error) => handleLLMError(error, "Grammar Explanation"))
        .finally(() => {
          setGrammarLoading(false);
        });
      promises.push(grammarPromise);
    }

    // Generate audio if enabled in settings
    if (settings.translationPopupAudio) {
      setAudioLoading(true);
      
      const audioPromise = generateAudio(apiKey, processedWord)
        .then((audio) => {
          if (audio === null) {
            customErrorAlert(); // Trigger alert if audio is null
          } else {
            setAudioBase64(audio);
          }
        })
        .catch((error) => {
          console.error("Error generating audio:", error);
          customErrorAlert();
        })
        .finally(() => {
          setAudioLoading(false);
        });
      promises.push(audioPromise);
    }

    // Start the parallel LLM request for ModuleA if enabled
    if (settings.translationPopupModuleA) {
      setModuleALoading(true);
      const moduleAPrompt = `Use "${processedWord}" in the context of "${innerContext}" and "${outerContext}". ${settings.moduleAPrompt}`;
      
      const moduleAPromise = callLLM(apiKey, moduleAPrompt)
        .then((moduleAResponse) => {
          if (moduleAResponse === null) {
            customErrorAlert(); // Trigger alert if response is null
          } else {
            setCurrentModuleA(moduleAResponse);
          }
        })
        .catch((error) => handleLLMError(error, "ModuleA"))
        .finally(() => {
          setModuleALoading(false);
        });
      promises.push(moduleAPromise);
    }

    // Start the parallel LLM request for ModuleB if enabled
    if (settings.translationPopupModuleB) {
      setModuleBLoading(true);
      const moduleBPrompt = `Use "${processedWord}" in the context of "${innerContext}" and "${outerContext}". ${settings.moduleBPrompt}`;
      
      const moduleBPromise = callLLM(apiKey, moduleBPrompt)
        .then((moduleBResponse) => {
          if (moduleBResponse === null) {
            customErrorAlert(); // Trigger alert if response is null
          } else {
            setCurrentModuleB(moduleBResponse);
          }
        })
        .catch((error) => handleLLMError(error, "ModuleB"))
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
