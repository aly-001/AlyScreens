import * as SQLite from 'expo-sqlite';

const generateWordDef = async (word, innerContext, outerContext) => {
  const wordDef = "DEFINITION of " + word;
  return wordDef;
}

const generateContextDef = async (word, innerContext, outerContext) => {
  const contextDef = "DEFINITION of " + innerContext;
  return contextDef;
}

const generateAndSaveImage = async (word, innerContext, outerContext, imageID) => {
  // to simulate the image generation process, log after about 5 seconds
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Image generated and saved");
      resolve();
    }, 5000);
  });
}

const generateAndSaveAudioWord = async (word, languageTag, audioWordID) => {
  // to simulate the audio generation process, log after about 3 seconds
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Audio word generated and saved");
      resolve();
    }, 3000);
  });
}

const generateAndSaveAudioContext = async (innerContext, languageTag, audioContextID) => {
  // to simulate the audio generation process, log after about 3 seconds
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Audio context generated and saved");
      resolve();
    }, 3500);
  });
}

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
  
    const wordDefPromise = generateWordDef(word, innerContext, outerContext);
    const contextDefPromise = generateContextDef(word, innerContext, outerContext);
    const imagePromise = generateAndSaveImage(word, innerContext, outerContext, imageID);
    const audioWordPromise = generateAndSaveAudioWord(word, languageTag, audioWordID);
    const audioContextPromise = generateAndSaveAudioContext(innerContext, languageTag, audioContextID);

    const [wordDef, contextDef] = await Promise.all([wordDefPromise, contextDefPromise]);

    const cardData = {
      word,
      context: innerContext,
      wordDef,
      contextDef,
      imageID,
      audioWordID,
      audioContextID
    };

    const newCard = {
      id: flashcardID,
      combinations: [{ front: [0], back: [1] }],
      fields: [JSON.stringify(cardData)]
    };

    await db.runAsync(
      'INSERT INTO masters (id, data) VALUES (?, ?)',
      [newCard.id, JSON.stringify(newCard)]
    );

    Promise.all([imagePromise, audioWordPromise, audioContextPromise])
      .then(() => {
        console.log('All media generated successfully');
      })
      .catch(error => {
        console.error('Error generating media:', error);
      });

    return newCard;
  } catch (error) {
    console.error('Error adding card:', error);
    throw new Error('Failed to add new card: ' + error.message);
  } finally {
    if (db) {
      db.closeAsync();
    }
  }
};