import React from "react";
import { View, StyleSheet, Text, SafeAreaView, StatusBar, TouchableWithoutFeedback } from "react-native";
import colors from "../config/colors";
import PracticeStatsFooter from "../components/PracticeStatsFooter";
import PracticeDividerLine from "../components/PracticeDividerLine";
import { useFlashcards } from "../context/FlashcardContext";

export default function PracticeScreenWord({ navigation }) {
  const { currentCard, stats } = useFlashcards();

  const handlePress = () => {
    navigation.navigate('Def');
  };

  const renderCardContent = () => {
    if (!currentCard) return <Text>No more cards available</Text>;
    let frontData;
    try {
      frontData = JSON.parse(currentCard.front[0]);
    } catch (error) {
      console.error('Error parsing card data:', error);
      return <Text>Error: Could not parse card data</Text>;
    }
    if (!frontData || typeof frontData !== 'object') {
      console.error('Invalid card data format');
      return <Text>Error: Invalid card data format</Text>;
    }
    return (
      <>
        <View style={styles.wordContainer}>
          <Text style={styles.word}>{frontData.word || 'N/A'}</Text>
        </View>
        <View style={styles.dividerLine}>
          <PracticeDividerLine width="100%" height={2} color={colors.utilityGreyUltraLight} />
        </View>
        <View style={styles.contextContainer}>
          <Text style={styles.context}>{frontData.context || 'N/A'}</Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.container}>
          {renderCardContent()}
          <View style={styles.footer}>
            <PracticeStatsFooter
              newCount={stats.new}
              learnCount={stats.learning}
              dueCount={stats.due}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  superContainer: {
    flex: 1,
  },
  container: {
    marginHorizontal: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  wordContainer: {
  },
  contextContainer: {
  },
  word: {
    fontSize: 50,
    fontWeight: "600",
    color: colors.utilityGrey,
  },
  context: {
    fontSize: 25,
    fontWeight: "500",
    color: colors.utilityGrey,
  },
  footer: {
    position: "absolute",
    alignSelf: "center",
    bottom: 60,
  },
  dividerLine: {
    marginVertical: 50,
    width: '100%',
  },
});