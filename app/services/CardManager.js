import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import OpenAI from 'openai';
import { callLLM } from './LLMManager';

const createOpenAIInstance = (apiKey) => {
  return new OpenAI({ apiKey });
};

const summarizeContext = async(apiKey, word, innerContext) =>{
  const prompt = `I’ve got two variables: word, innerContext. Your job is to summarize innerContext. For example, word: “éclairée” innerContext: “connaissance. C'était une grande salle éclairée par cinq ou six fenêtres, au-de”. You need to answer: “Une grande salle éclairée par cinq ou six fenêtres.”  Note that your final answer should include the word. Here are the variables: word: ${word}, innerContext: ${innerContext}`;
  return callLLM(apiKey, prompt);
}

const generateWordDef = async (apiKey, word, innerContext, outerContext) => {
  const prompt = `Give the translation of ${word} given the inner context "${innerContext}" and the outer context "${outerContext}". Please respond in English. You can give a few definitions if relevant but in general your answer shouldn't be more than 3 words.`;
  return callLLM(apiKey, prompt);
}

const generateContextDef = async (apiKey, word, summarizedContext, outerContext) => {
  const prompt = `Give a short (no more than 20 words and no less than 3 words) translation of the phrase "${summarizedContext}" focusing on the word "${word}". Additional context: ${outerContext}. Please respond in English.`;
  return callLLM(apiKey, prompt);
}

const generateGrammarExplanation = async (apiKey, word, innerContext, outerContext, prompt) => {
  return callLLM(apiKey, prompt);
}

const generateCustomModuleA = async (apiKey, word, innerContext, outerContext, prompt) => {
  const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
  const fullPrompt = `Use "${capitalizedWord}" in the context of "${innerContext}" and "${outerContext}". ${prompt}`;
  return callLLM(apiKey, fullPrompt);
}

const generateCustomModuleB = async (apiKey, word, innerContext, outerContext, prompt) => {
  const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
  const fullPrompt = `Use "${capitalizedWord}" in the context of "${innerContext}" and "${outerContext}". ${prompt}`;
  return callLLM(apiKey, fullPrompt);
}

const generateAndSaveImage = async (openai, word, innerContext, outerContext, imageID, imagePrompt) => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `make a picture about ${word} in the context of ${innerContext} and ${outerContext}. do it in the following style: ${imagePrompt}`,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = response.data[0].url;

    // Download and resize the image
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUrl,
      [
        { resize: {
          width: 800, // Half of the original width
          height: 700, // Half of the original height
        }}
      ],
      { format: 'png' }
    );

    // Define the directory and file path
    const directory = `${FileSystem.documentDirectory}images/`;
    const filePath = `${directory}${imageID}.png`;

    // Ensure the directory exists
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

    // Write the file
    await FileSystem.copyAsync({
      from: manipResult.uri,
      to: filePath
    });

    console.log(`Resized image file saved at: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Error generating, resizing, or saving image:", error);
    throw error;
  }
};

const generateAndSaveAudioWord = async (openai, word, audioWordID) => {
  try {
    // Generate speech using OpenAI API
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: `. ${word}!!`,
    });

    // Get the audio data as an ArrayBuffer
    const audioData = await response.arrayBuffer();

    // Define the directory and file path
    const directory = `${FileSystem.documentDirectory}audio/`;
    const filePath = `${directory}${audioWordID}.mp3`;

    // Ensure the directory exists
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

    // Write the file
    await FileSystem.writeAsStringAsync(filePath, arrayBufferToBase64(audioData), { encoding: FileSystem.EncodingType.Base64 });

    console.log(`Audio file saved at: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Error generating or saving audio:", error);
    throw error;
  }
};

const generateAndSaveAudioContext = async (openai, context, audioContextID) => {
  try {
    // Generate speech using OpenAI API
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: context,
    });

    // Get the audio data as an ArrayBuffer
    const audioData = await response.arrayBuffer();

    // Define the directory and file path
    const directory = `${FileSystem.documentDirectory}audio/`;
    const filePath = `${directory}${audioContextID}.mp3`;

    // Ensure the directory exists
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

    // Write the file
    await FileSystem.writeAsStringAsync(filePath, arrayBufferToBase64(audioData), { encoding: FileSystem.EncodingType.Base64 });

    // console.log(`Audio file saved at: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Error generating or saving audio:", error);
    throw error;
  }
};
// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${randomPart}`;
};

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  async getConnection() {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync('flashcards.db');
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS masters (id TEXT PRIMARY KEY, data TEXT);
        CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, data TEXT);
      `);
    }
    return this.db;
  }

  async closeConnection() {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export const dbManager = new DatabaseManager();

export const addCard = async (apiKey, word, innerContext, outerContext, languageTag, settings) => {
  const db = await dbManager.getConnection();
  const flashcardID = generateId();
  const imageID = `${flashcardID}-image`;
  const audioWordID = `${flashcardID}-audio-word`;
  const audioContextID = `${flashcardID}-audio-context`;
  
  // Create OpenAI instance with the provided API key
  const openai = createOpenAIInstance(apiKey);

  try {
    const summarizedContext = await summarizeContext(apiKey, word, innerContext);
    
    const mediaPromises = [];
    if (settings.flashcardsBackImage) {
      mediaPromises.push(generateAndSaveImage(openai, word, innerContext, outerContext, imageID, settings.imagePrompt));
    }
    if (settings.flashcardsBackAudio) {
      mediaPromises.push(generateAndSaveAudioWord(openai, word, audioWordID, languageTag));
    }
    if (settings.flashcardsBackContextAudio) {
      mediaPromises.push(generateAndSaveAudioContext(openai, summarizedContext, audioContextID, languageTag));
    }
   
    const grammarPrompt = `Give a grammar explanation of the word "${word}" in the context of "${innerContext}" and "${outerContext}". ${settings.grammarPrompt}`;
    // Perform LLM operations
    const [wordDef, contextDef, grammarExplanation, moduleA, moduleB] = await Promise.all([
      settings.flashcardsBackWordTranslation ? generateWordDef(apiKey, word, innerContext, outerContext) : null,
      settings.flashcardsBackContextTranslation ? generateContextDef(apiKey, word, summarizedContext, outerContext) : null,
      (settings.flashcardsFrontGrammar || settings.flashcardsBackGrammar) ? generateGrammarExplanation(apiKey, word, innerContext, outerContext, grammarPrompt) : null,
      (settings.flashcardsFrontModuleA || settings.flashcardsBackModuleA) ? generateCustomModuleA(apiKey, word, innerContext, outerContext, settings.moduleAPrompt) : null,
      (settings.flashcardsFrontModuleB || settings.flashcardsBackModuleB) ? generateCustomModuleB(apiKey, word, innerContext, outerContext, settings.moduleBPrompt) : null,
    ]);
    
    const cardDataFront = {
      word: settings.flashcardsFrontWord ? word : null,
      context: settings.flashcardsFrontContext ? summarizedContext : null,
      grammarExplanation: settings.flashcardsFrontGrammar ? grammarExplanation : null,
      moduleA: settings.flashcardsFrontModuleA ? moduleA : null,
      moduleB: settings.flashcardsFrontModuleB ? moduleB : null,
    };
    
    const cardDataBack = { 
      word: settings.flashcardsBackWord ? word : null, 
      context: settings.flashcardsBackContext ? summarizedContext : null, 
      wordDef: settings.flashcardsBackWordTranslation ? wordDef : null, 
      grammarExplanation: settings.flashcardsBackGrammar ? grammarExplanation : null,
      contextDef: settings.flashcardsBackContextTranslation ? contextDef : null, 
      moduleA: settings.flashcardsBackModuleA ? moduleA : null,
      moduleB: settings.flashcardsBackModuleB ? moduleB : null,
      imageID: settings.flashcardsBackImage ? imageID : null,
      audioWordID: settings.flashcardsBackAudio ? audioWordID : null,
      audioContextID: settings.flashcardsBackContextAudio ? audioContextID : null,
    };
    
    const newCard = {
      id: flashcardID,
      combinations: [{ front: [0], back: [1] }],
      fields: [JSON.stringify(cardDataFront), JSON.stringify(cardDataBack)]
    };
    
    // Database operation
    await db.runAsync(
      'INSERT INTO masters (id, data) VALUES (?, ?)',
      [newCard.id, JSON.stringify(newCard)]
    );
    
    // Wait for media generation to complete
    if (mediaPromises.length > 0) {
      await Promise.all(mediaPromises);
      console.log('Card added successfully and all selected media generated');
    } else {
      console.log('Card added successfully (no media generated)');
    }
    
    return newCard;
  } catch (error) {
    console.error('Error adding card:', error);
    throw new Error('Failed to add new card: ' + error.message);
  }
};

// Use this when your app is closing or you're done with database operations
export const cleanupDatabase = async () => {
  await dbManager.closeConnection();
};
