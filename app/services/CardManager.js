import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import OpenAI from 'openai';
import { useSettingsContext } from '../context/useSettingsContext';

const openai = new OpenAI({
  apiKey: "sk-proj-5auFOzAUeUREckxZsroCT3BlbkFJCu9rISeIc0pBqiMyrM6W",
});

async function callLLM(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling LLM: ", error);
    return null;
  }
}

const summarizeContext = async(word, innerContext) =>{
  const prompt = `I’ve got two variables: word, innerContext. Your job is to summarize innerContext. For example, word: “éclairée” innerContext: “connaissance. C'était une grande salle éclairée par cinq ou six fenêtres, au-de”. You need to answer: “Une grande salle éclairée par cinq ou six fenêtres.”  Note that your final answer should include the word. Here are the variables: word: ${word}, innerContext: ${innerContext}`;
  return callLLM(prompt);
}

const generateWordDef = async (word, innerContext, outerContext) => {
  const prompt = `Give the translation of ${word} given the inner context "${innerContext}" and the outer context "${outerContext}". Please respond in English. You can give a few definitions if relevant but in general your answer shouldn't be more than 3 words.`;
  return callLLM(prompt);
}

const generateContextDef = async (word, summarizedContext, outerContext) => {
  const prompt = `Give a short (no more than 20 words and no less than 3 words) translation of the phrase "${summarizedContext}" focusing on the word "${word}". Additional context: ${outerContext}. Please respond in English.`;
  return callLLM(prompt);
}

const generateAndSaveImage = async (word, innerContext, outerContext, imageID) => {
  try {
    // Generate image using DALL-E API
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${innerContext} ${word} ${outerContext}`,
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

const generateAndSaveAudioWord = async (word, audioWordID) => {
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

const generateAndSaveAudioContext = async (context, audioContextID) => {
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

    console.log(`Audio file saved at: ${filePath}`);
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

export const addCard = async (word, innerContext, outerContext, languageTag, settings) => {
  const db = await dbManager.getConnection();
  const flashcardID = generateId();
  const imageID = `${flashcardID}-image`;
  const audioWordID = `${flashcardID}-audio-word`;
  const audioContextID = `${flashcardID}-audio-context`;
  try {
    // Start media generation early and in parallel
    console.log("SETTINGS", settings);
    const summarizedContext = await summarizeContext(word, innerContext);
    
    const mediaPromises = [];
    if (settings.generateImage) {
      mediaPromises.push(generateAndSaveImage(word, innerContext, outerContext, imageID));
    }
    if (settings.generateAudioWord) {
      mediaPromises.push(generateAndSaveAudioWord(word, audioWordID, languageTag));
    }
    if (settings.generateAudioContext) {
      mediaPromises.push(generateAndSaveAudioContext(summarizedContext, audioContextID, languageTag));
    }
    
    // Perform LLM operations (these can also be parallelized if they're independent)
    const [wordDef, contextDef] = await Promise.all([
      generateWordDef(word, innerContext, outerContext),
      generateContextDef(word, summarizedContext, outerContext)
    ]);
    
    const cardDataFront = { word, context: summarizedContext };
    const cardDataBack = { 
      word, 
      context: summarizedContext, 
      wordDef, 
      contextDef, 
      imageID: settings.generateImage ? imageID : null,
      audioWordID: settings.generateAudioWord ? audioWordID : null,
      audioContextID: settings.generateAudioContext ? audioContextID : null
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
