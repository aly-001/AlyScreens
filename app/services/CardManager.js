import * as SQLite from 'expo-sqlite';
import OpenAI from 'openai';

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

const simulateMediaGeneration = (name, delay) => 
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${name} generated and saved`);
      resolve();
    }, delay);
  });

const generateAndSaveImage = (word, innerContext, outerContext, imageID) => 
  simulateMediaGeneration("Image", 5000);

const generateAndSaveAudioWord = (word, languageTag, audioWordID) => 
  simulateMediaGeneration("Audio word", 3000);

const generateAndSaveAudioContext = (innerContext, languageTag, audioContextID) => 
  simulateMediaGeneration("Audio context", 3500);

const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${randomPart}`;
};

const initializeDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('flashcards.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS masters (id TEXT PRIMARY KEY, data TEXT);
      CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, data TEXT);
    `);
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export const addCard = async (word, innerContext, outerContext, languageTag) => {
  let db;
  try {
    db = await initializeDatabase();

    const flashcardID = generateId();
    const imageID = `${flashcardID}-image`;
    const audioWordID = `${flashcardID}-audio-word`;
    const audioContextID = `${flashcardID}-audio-context`;

    // Summarize context first
    const summarizedContext = await summarizeContext(word, innerContext);
    console.log('Summarized context:', summarizedContext);

    // Then generate definitions using the summarized context
    const [wordDef, contextDef] = await Promise.all([
      generateWordDef(word, innerContext, outerContext),
      generateContextDef(word, summarizedContext, outerContext)
    ]);

    console.log('Word definition:', wordDef);
    console.log('Context definition:', contextDef);

    const cardDataFront = { word, context: summarizedContext };
    const cardDataBack = { word, context: summarizedContext, wordDef, contextDef, imageID, audioWordID, audioContextID };

    const newCard = {
      id: flashcardID,
      combinations: [{ front: [0], back: [1] }],
      fields: [JSON.stringify(cardDataFront), JSON.stringify(cardDataBack)]
    };

    await db.runAsync(
      'INSERT INTO masters (id, data) VALUES (?, ?)',
      [newCard.id, JSON.stringify(newCard)]
    );

    console.log('Card added to database:', newCard);

    // Start media generation after card is added to database
    Promise.all([
      generateAndSaveImage(word, summarizedContext, outerContext, imageID),
      generateAndSaveAudioWord(word, languageTag, audioWordID),
      generateAndSaveAudioContext(summarizedContext, languageTag, audioContextID)
    ]).then(() => {
      console.log('All media generated successfully');
    }).catch(error => {
      console.error('Error generating media:', error);
    });

    return newCard;
  } catch (error) {
    console.error('Error adding card:', error);
    throw new Error('Failed to add new card: ' + error.message);
  } finally {
    if (db) {
      await db.closeAsync();
    }
  }
};