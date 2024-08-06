import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { DolphinSR } from "../../lib/index";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useVirtualDate = () => {
  const [virtualDate, setVirtualDate] = useState(new Date());

  useEffect(() => {
    const loadVirtualDate = async () => {
      const storedDate = await AsyncStorage.getItem('virtualDate');
      if (storedDate) {
        setVirtualDate(new Date(storedDate));
      }
    };
    loadVirtualDate();
  }, []);

  const advanceTime = useCallback(async (days) => {
    const newDate = new Date(virtualDate.getTime() + days * 24 * 60 * 60 * 1000);
    setVirtualDate(newDate);
    await AsyncStorage.setItem('virtualDate', newDate.toISOString());
  }, [virtualDate]);

  const resetToCurrentTime = useCallback(async () => {
    const currentDate = new Date();
    setVirtualDate(currentDate);
    await AsyncStorage.setItem('virtualDate', currentDate.toISOString());
  }, []);

  return [virtualDate, advanceTime, resetToCurrentTime];
};

const FlashcardTest = () => {
  const [virtualDate, advanceTime, resetToCurrentTime] = useVirtualDate();
  const [db, setDb] = useState(null);
  const [dolphinSR, setDolphinSR] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [showingFront, setShowingFront] = useState(true);
  const [stats, setStats] = useState({
    new: 0,
    learning: 0,
    later: 0,
    due: 0,
    mature: 0,
    overdue: 0
  });

  useEffect(() => {
    initializeDatabase();
  }, []);

  useEffect(() => {
    if (dolphinSR) {
      dolphinSR._currentDateGetter = () => virtualDate;
      dolphinSR._rebuild();
      updateStats(dolphinSR);
      getNextCard(dolphinSR);
    }
  }, [virtualDate]);

  const initializeDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('flashcards.db');
      setDb(database);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS masters (id TEXT PRIMARY KEY, data TEXT);
        CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, data TEXT);
      `);

      const dolphinSRInstance = new DolphinSR(() => virtualDate);
      setDolphinSR(dolphinSRInstance);
      await loadDeck(database, dolphinSRInstance);
    } catch (error) {
      console.error('Database initialization error:', error);
    }
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

      // console.log('Loaded deck:', dolphinSRInstance.summary());
      // console.log('Masters:', loadedMasters);
      // console.log('Reviews:', loadedReviews);

      updateStats(dolphinSRInstance);
      getNextCard(dolphinSRInstance);
    } catch (error) {
      console.error('Load deck error:', error);
    }
  };

  const updateStats = (dolphinSRInstance) => {
    const currentStats = dolphinSRInstance.summary();
    setStats(currentStats);
  };

  const getNextCard = (dolphinSRInstance) => {
    const nextCard = dolphinSRInstance.nextCard();
    setCurrentCard(nextCard);
    setShowingFront(true);
    updateStats(dolphinSRInstance);
  };

  const addCard = async (front, back) => {
    const newCard = {
      id: generateId(),
      combinations: [{ front: [0], back: [1] }],
      fields: [front, back],
    };

    try {
      await db.runAsync(
        'INSERT INTO masters (id, data) VALUES (?, ?)',
        [newCard.id, JSON.stringify(newCard)]
      );
      dolphinSR.addMasters(newCard);
      updateStats(dolphinSR);
      getNextCard(dolphinSR);
    } catch (error) {
      console.error('Error adding card:', error);
    }
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
      getNextCard(dolphinSR);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const flipCard = () => setShowingFront(!showingFront);

  const renderCardContent = () => {
    if (!currentCard) return <Text>No card data available</Text>;
    const content = showingFront ? currentCard.front : currentCard.back;
    return <Text style={styles.cardText}>{content.join(', ') || 'No content'}</Text>;
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
      const newDolphinSR = new DolphinSR(() => virtualDate);
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

  const flashcards = [
    { front: 'Flashcard Test Jul 16 - 1', back: 'Back 1' },
    { front: 'Flashcard Test Jul 16 - 2', back: 'Back 2' },
    { front: 'Flashcard Test Jul 16 - 3', back: 'Back 3' },
    { front: '水', back: 'water' },
    { front: '食べる', back: 'to eat' },
    { front: '行く', back: 'to go' },
    { front: '見る', back: 'to see' },
    { front: '車', back: 'car' },
    { front: '家', back: 'house' },
    { front: '学校', back: 'school' },
    { front: '友達', back: 'friend' },
    { front: '音楽', back: 'music' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Current Virtual Date: {virtualDate.toDateString()}</Text>
      <Text style={styles.statsText}>
        New: {stats.new}, Learning: {stats.learning}, Young: {stats.later}, Due: {stats.due}
      </Text>
      {renderCardContent()}
      <Button title="Flip" onPress={flipCard} />
      {currentCard && !showingFront && (
        <View style={styles.ratingContainer}>
          <Button title="Again" onPress={() => submitReview('again')} />
          <Button title="Hard" onPress={() => submitReview('hard')} />
          <Button title="Good" onPress={() => submitReview('good')} />
          <Button title="Easy" onPress={() => submitReview('easy')} />
        </View>
      )}
      <View style={styles.addCardContainer}>
        <Text>Add a new card:</Text>
        {flashcards.map((card, index) => (
          <Button 
            key={index}
            title={`Add '${card.front}' - '${card.back}'`}
            onPress={() => addCard(card.front, card.back)}
          />
        ))}
      </View>
      <View style={styles.timeControlContainer}>
        <Button 
          title="Advance Time by 3 Days" 
          onPress={() => advanceTime(3)}
        />
        <Button 
          title="Reset to Current Time" 
          onPress={resetToCurrentTime}
        />
      </View>
      <Button title="Clear Database" onPress={clearDatabase} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statsText: {
    marginBottom: 20,
  },
  cardText: {
    fontSize: 24,
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  addCardContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  timeControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default FlashcardTest;