import { View, StyleSheet, Text, Dimensions } from 'react-native';
import React from 'react';
import colors from '../config/colors';
import PracticeStatsFooter from '../components/PracticeStatsFooter';
import PracticeRatingTab from '../components/PracticeRatingTab';

const { width, height } = Dimensions.get('window');

export default function PracticeScreenWord({definition, statsLearn, statsNew, statsDue, onSelectDifficulty}) {
  const handleRatingPress = (rating) => {
    if (onSelectDifficulty) {
      onSelectDifficulty(rating);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.defContainer}>
        <Text style={styles.word}>{definition}</Text> 
      </View> 
      <View style={styles.footer}>
        <PracticeStatsFooter newCount={statsNew} learnCount={statsLearn} dueCount={statsDue}/>
      </View>
      <View style={styles.allTabsContainer}>
        <View style={styles.tabContainer}>
          <PracticeRatingTab rating="Again" onPress={handleRatingPress} />
        </View>
        <View style={styles.tabContainer}>
          <PracticeRatingTab rating="Hard" onPress={handleRatingPress} />
        </View>
        <View style={styles.tabContainer}>
          <PracticeRatingTab rating="Good" onPress={handleRatingPress} />
        </View>
        <View style={styles.tabContainer}>
          <PracticeRatingTab rating="Easy" onPress={handleRatingPress} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.homeScreenBackground,
  },
  defContainer: {
    marginLeft: 40,
    width: width * 0.8,
  },
  word: {
    fontSize: 22,
    fontWeight: "500",
    color: colors.utilityGrey,
    opacity: 0.85,
  },
  footer: {
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
  },
  allTabsContainer: {
    position: "absolute",
    bottom: height * 0.25, // Positioned at 1/4 of the screen height from the bottom
    right: 0,
  },
  tabContainer: {
    marginBottom: 10,
  }
});