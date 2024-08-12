
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';
import { DolphinSR } from "../../lib/index";
import { clearAudioDiectory, listAudioDirectory, clearImageDiectory } from '../services/MediaSurfer';

const FlashcardContext = createContext();

export const useFlashcards = () => useContext(FlashcardContext);

export const getAllCards = (dolphinSR) => {
  return dolphinSR.getAll().filter(Boolean);
};

export const getYoungCards = (dolphinSR) => {
  return dolphinSR.getYoung().filter(Boolean);
};

export const getMatureCards = (dolphinSR) => {
  return dolphinSR.getMature().filter(Boolean);
};

export const FlashcardProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [dolphinSR, setDolphinSR] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [stats, setStats] = useState({
    new: 0,
    learning: 0,
    later: 0,
    due: 0,
    mature: 0,
    overdue: 0
  });
  const [newCards, setNewCards] = useState([]);
  const [learningCards, setLearningCards] = useState([]);
  const [dueCards, setDueCards] = useState([]);
  const [laterCards, setLaterCards] = useState([]);
  const [overdueCards, setOverdueCards] = useState([]);
  const [allCards, setAllCards] = useState([]); // New state for all cards
  const [youngCards, setYoungCards] = useState([]); // New state for young cards
  const [matureCards, setMatureCards] = useState([]); // New state for mature cards

  useEffect(() => {
    initializeDatabase();
  }, []);


  const initializeDatabase = async () => {
    // if (db && dolphinSR) {
    //   console.log('Database already initialized');
    //   return;
    // }
    // listAudioDirectory();
    try {
      const database = await SQLite.openDatabaseAsync('flashcards.db');
      setDb(database);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS masters (id TEXT PRIMARY KEY, data TEXT);
        CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, data TEXT);
      `);
      
      // ***DON'T TOUCH THIS***
      // clearDatabase(database); 
      // console.log('Database cleared');
      // clearAudioDiectory();
      // clearImageDiectory();

      const dolphinSRInstance = new DolphinSR();
      setDolphinSR(dolphinSRInstance);
      await loadDeck(database, dolphinSRInstance);
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };

  const processCard = (card) => {
    try {
      // Parse the JSON from the front of the card
      const frontData = JSON.parse(card.front[0]);
      
      // Get the id and word
      const id = card.master;
      const word = frontData.word;
      
      // Return an object with the id and word
      return {
        id: id,
        front: word
      };
    } catch (error) {
      console.error('Error processing card:', error);
      console.error('Problematic card:', card);
      return null; // Return null for cards that couldn't be processed
    }
  };

  const updateWords = (dolphinSRInstance) => {
    const newCards = dolphinSRInstance.getNewCards().map(processCard).filter(Boolean);
    const learningCards = dolphinSRInstance.getLearningCards().map(processCard).filter(Boolean);
    const dueCards = dolphinSRInstance.getDueCards().map(processCard).filter(Boolean);
    const laterCards = dolphinSRInstance.getLaterCards().map(processCard).filter(Boolean);
    const overdueCards = dolphinSRInstance.getOverdueCards().map(processCard).filter(Boolean);
    const allCards = dolphinSRInstance.getAll().map(processCard).filter(Boolean);
    const youngCards = dolphinSRInstance.getYoung().map(processCard).filter(Boolean);
    const matureCards = dolphinSRInstance.getMature().map(processCard).filter(Boolean);
    
    setNewCards(newCards);
    setLearningCards(learningCards);
    setDueCards(dueCards);
    setLaterCards(laterCards);
    setOverdueCards(overdueCards);
    setAllCards(allCards);
    setYoungCards(youngCards);
    setMatureCards(matureCards);
  };

  const loadDeck = async (database, dolphinSRInstance) => {
    try {
      const mastersResult = await database.getAllAsync('SELECT * FROM masters');
      const reviewsResult = await database.getAllAsync('SELECT * FROM reviews');
      
      const loadedMasters = mastersResult.map(row => JSON.parse(row.data));
      const loadedReviews = reviewsResult.map(row => ({
        ...JSON.parse(row.data),
        ts: new Date(JSON.parse(row.data).ts)
      }));
      
      dolphinSRInstance.addMasters(...loadedMasters);
      dolphinSRInstance.addReviews(...loadedReviews);
      
      // updateStats(dolphinSRInstance);
      getNextCard(dolphinSRInstance);
      updateWords(dolphinSRInstance);

      setStats(dolphinSRInstance.summary());
      
      // console.log('New Cards:', newCards);
      // console.log('Learning Cards:', learningCards);
      // console.log('Due Cards:', dueCards);
    } catch (error) {
      console.error('Load deck error:', error);
      console.error('Error stack:', error.stack);
    }
  };

  const updateStats = useCallback(() => {
    if (dolphinSR) {
      const currentStats = dolphinSR.summary();
      setStats(currentStats);
    }
  }, [dolphinSR]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeDatabase().then(() => setIsLoading(false));
  }, []);
  
  const getNextCard = () => {
    if (isLoading) {
      return null;
    }
    if (!dolphinSR) {
      console.error('DolphinSR instance not initialized');
      return null;
    }
    const nextCard = dolphinSR.nextCard();
    setCurrentCard(nextCard);
    updateStats(dolphinSR);
    return nextCard;
  };


  const submitReview = async (rating) => {
    if (!currentCard) return;

    const review = {
      master: currentCard.master,
      combination: currentCard.combination,
      ts: new Date(),
      rating: rating
    };

    dolphinSR.addReviews(review);

    const timeStamp = Date.now().toString();

    try {
      await db.runAsync(
        'INSERT OR REPLACE INTO reviews (id, data) VALUES (?, ?)',
        [timeStamp, JSON.stringify(review)]
      );
      updateStats(dolphinSR);
      updateWords(dolphinSR);
      getNextCard(dolphinSR);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const clearDatabase = async () => {
    if (!db) return;
    try {
      await db.execAsync(`
        DELETE FROM masters;
        DELETE FROM reviews;
        DELETE FROM dolphin_state;
      `);
      
      setCurrentCard(null);
      const newDolphinSR = new DolphinSR();
      setDolphinSR(newDolphinSR);
      updateStats(newDolphinSR);
    } catch (error) {
      console.error('Error clearing database:', error);
    }
  };

  const generateId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomPart}`;
  };

  return (
    <FlashcardContext.Provider value={{
      initializeDatabase,
      stats,
      currentCard,
      getNextCard,
      submitReview,
      clearDatabase,
      newCards,
      learningCards,
      dueCards,
      laterCards,
      overdueCards,
      allCards,
      youngCards,
      matureCards,
      updateStats,
    }}>
      {children}
    </FlashcardContext.Provider>
  );
};