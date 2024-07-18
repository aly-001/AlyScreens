import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useFlashcards } from '../context/FlashcardContext';

const FlashcardTest = () => {
  const { stats, currentCard, getNextCard, submitReview, clearDatabase } = useFlashcards();
  const [showingFront, setShowingFront] = useState(true);

  const flipCard = () => setShowingFront(!showingFront);

  const renderCardContent = () => {
    if (!currentCard) return <Text>No card data available</Text>;
    const content = showingFront ? currentCard.front : currentCard.back;
    return <Text style={styles.cardText}>{content.join(', ') || 'No content'}</Text>;
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
            onPress={() => {
              console.log(`Adding card: ${card.front} - ${card.back}`);
            }}
          />
        ))}
      </View>
      <Button title="Get Next Card" onPress={getNextCard} />
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
});

export default FlashcardTest;