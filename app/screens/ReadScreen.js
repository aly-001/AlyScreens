import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import EpubPicker from '../components/EpubPicker';
import { saveEpub, loadStoredEpub } from '../services/EpubManager';
import EpubReader from '../Reader/EpubReader';
import OpenAI from "openai";
import DefinitionPopup from '../components/DefinitionPopup'; // Import the new component

const openai = new OpenAI({
  apiKey: "sk-proj-5auFOzAUeUREckxZsroCT3BlbkFJCu9rISeIc0pBqiMyrM6W",
});

async function fetchDefinition(word, innerContext, outerContext) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `give a short (no more than 20 words and no less than 3 words) definition of ${word} in the context of ${innerContext}. Here's more context if you need it. ${outerContext} Oh and in english please.`,
        },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching definition: ", error);
    return null;
  }
}

export default function ReadScreen() {
  const [fileUri, setFileUri] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [currentDefinition, setCurrentDefinition] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    loadEpub();
  }, []);

  const loadEpub = async () => {
    const uri = await loadStoredEpub();
    setFileUri(uri);
  };

  const handlePickComplete = async (fileAsset) => {
    try {
      const uri = await saveEpub(fileAsset);
      setFileUri(uri);
      Alert.alert('Success', 'EPUB file stored successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to store EPUB file');
    }
  };

  const handleWebViewMessage = async (message) => {
    setCurrentDefinition('');
    const cleanWord = message.word.replace(/^[^\w]+|[^\w]+$/g, '');
    const capitalizedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    setCurrentWord(capitalizedWord);
    const { innerContext, outerContext } = message;
  
    setPopupVisible(true);
    const definition = await fetchDefinition(capitalizedWord, innerContext, outerContext);
    console.log("Definition:", definition);
  
    if (definition) {
      setCurrentDefinition(definition);
    } else {
      Alert.alert('Error', 'Unable to fetch definition. Please try again.');
    }

    // Send the word and definition to the server via WebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        word: capitalizedWord,
        definition
      }));
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  }

  if (fileUri) {
    return (
      <ReaderProvider>
        <EpubReader uri={fileUri} fileSystem={useFileSystem} handleWebViewMessage={handleWebViewMessage}/>
        <DefinitionPopup
          visible={popupVisible}
          onClose={handleClosePopup}
          word={currentWord}
          definition={currentDefinition}
        />
      </ReaderProvider>
    );
  } else {
    return (
      <View>
        <Text>No EPUB file selected</Text>
        <EpubPicker onPickComplete={handlePickComplete} />
      </View>
    );
  }
}
