import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
const { DolphinSR } = require("../../lib/index");

const FlashcardTest = () => {
  const [db, setDb] = useState(null);
  const [dolphinSR, setDolphinSR] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [showingFront, setShowingFront] = useState(true);
  const [masters, setMasters] = useState([]);
  const [reviews, setReviews] = useState([]);
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

  function generateId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomPart}`;
  }
  
  const initializeDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('flashcards.db');
      setDb(database);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS masters (id TEXT PRIMARY KEY, data TEXT);
        CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, data TEXT);
      `);

      // clearDatabase(database);

      const dolphinSRInstance = new DolphinSR();
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

      console.log('Reviews result:', reviewsResult);

      const loadedMasters = mastersResult.map(row => JSON.parse(row.data));
      const loadedReviews = reviewsResult.map(row => ({
        ...JSON.parse(row.data),
        ts: new Date(JSON.parse(row.data).ts)
      }));

      setMasters(loadedMasters);
      setReviews(loadedReviews);

      dolphinSRInstance.addMasters(...loadedMasters);
      dolphinSRInstance.addReviews(...loadedReviews);

      updateStats(dolphinSRInstance);
      console.log('Masters:', loadedMasters);
      console.log('Reviews:', loadedReviews);

      getNextCard(dolphinSRInstance);
    } catch (error) {
      console.error('Load deck error:', error);
    }
  };

  const updateStats = (dolphinSRInstance) => {
    const currentStats = dolphinSRInstance.summary();
    setStats(currentStats);
    console.log('Stats:', currentStats);
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
      setMasters(prevMasters => {
        const updatedMasters = [...prevMasters, newCard];
        console.log('Masters:', updatedMasters);
        return updatedMasters;
      });
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

    setReviews(prevReviews => {
      const updatedReviews = [...prevReviews, review];
      console.log('Reviews:', updatedReviews);
      return updatedReviews;
    });
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

  const flipCard = () => {
    setShowingFront(!showingFront);
  };

  const renderCardContent = () => {
    if (!currentCard) {
      return <Text>No card data available</Text>;
    }
    const content = showingFront ? currentCard.front : currentCard.back;
    return <Text style={styles.cardText}>{content.join(', ') || 'No content'}</Text>;
  };

  const clearDatabase = async (database) => {
    try {
      await database.execAsync(`
        DELETE FROM masters;
        DELETE FROM reviews;
        DELETE FROM dolphin_state;
      `);
      
      // Reset the state
      setMasters([]);
      setReviews([]);
      setCurrentCard(null);
      const newDolphinSR = new DolphinSR();
      setDolphinSR(newDolphinSR);
      updateStats(newDolphinSR);
      
      console.log('Masters:', []);
      console.log('Reviews:', []);
    } catch (error) {
      console.error('Error clearing database:', error);
    }
  };

  return (
    <View style={styles.container}>
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
        <Button title="Add '猫' - 'cat'" onPress={() => addCard('猫', 'cat')} />
        <Button title="Add '犬' - 'dog'" onPress={() => addCard('犬', 'dog')} />
        <Button title="Add '本' - 'book'" onPress={() => addCard('本', 'book')} />
        <Button title="Add '水' - 'water'" onPress={() => addCard('水', 'water')} />
        <Button title="Add '食べる' - 'to eat'" onPress={() => addCard('食べる', 'to eat')} />
        <Button title="Add '行く' - 'to go'" onPress={() => addCard('行く', 'to go')} />
        <Button title="Add '見る' - 'to see'" onPress={() => addCard('見る', 'to see')} />
        <Button title="Add '車' - 'car'" onPress={() => addCard('車', 'car')} />
        <Button title="Add '家' - 'house'" onPress={() => addCard('家', 'house')} />
        <Button title="Add '学校' - 'school'" onPress={() => addCard('学校', 'school')} />
        <Button title="Add '友達' - 'friend'" onPress={() => addCard('友達', 'friend')} />
        <Button title="Add '音楽' - 'music'" onPress={() => addCard('音楽', 'music')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default FlashcardTest;