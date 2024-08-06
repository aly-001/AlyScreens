import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { DolphinSR } from "../../lib/index";

const FlashcardTest = () => {
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

  const clearDatabase = async (database) => {
    try {
      await database.execAsync(`
        DELETE FROM masters;
        DELETE FROM reviews;
      `);
      console.log('Database cleared successfully');
    } catch (error) {
      console.error('Error clearing database:', error);
    }
  };

  const initializeDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('flashcards.db');
      setDb(database);

      // await clearDatabase(database);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS masters (id TEXT PRIMARY KEY, data TEXT);
        CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, data TEXT);
      `);

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
    try {
      const nextCard = dolphinSRInstance.nextCard();
      // console.log('Next card from DolphinSR:', nextCard);
      
      if (nextCard) {
        setCurrentCard(nextCard);
        setShowingFront(true);
      } else {
        // console.log('No more cards available');
        setCurrentCard(null);
      }
      
      updateStats(dolphinSRInstance);
    } catch (error) {
      console.error('Error getting next card:', error);
      setCurrentCard(null);
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
    if (!currentCard) return <Text>No more cards available</Text>;
  
    // console.log('Current card:', currentCard);
  
    let frontData, backData;
    try {
      frontData = JSON.parse(currentCard.front[0]);
      backData = JSON.parse(currentCard.back[0]);
    } catch (error) {
      console.error('Error parsing card data:', error);
      return <Text>Error: Could not parse card data</Text>;
    }
  
    // console.log('Parsed front data:', frontData);
    // console.log('Parsed back data:', backData);
  
    if (!frontData || typeof frontData !== 'object' || !backData || typeof backData !== 'object') {
      console.error('Invalid card data format');
      return <Text>Error: Invalid card data format</Text>;
    }
  
    if (showingFront) {
      return (
        <View>
          <Text style={styles.cardText}>Word: {frontData.word || 'N/A'}</Text>
          <Text style={styles.cardText}>Context: {frontData.context || 'N/A'}</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.cardText}>Word Definition: {backData.wordDef || 'N/A'}</Text>
          <Text style={styles.cardText}>Context Definition: {backData.contextDef || 'N/A'}</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
    fontSize: 18,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default FlashcardTest;