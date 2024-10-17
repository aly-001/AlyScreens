import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import Screen from "../../components/Screen";
import { useThemeColors } from "../../config/colors";
import layout from "../../config/layout";
import WordBox from "../../components/WordBox";
import PracticeStartButton from "../../components/PracticeStartButton";
import { useFlashcards } from "../../context/FlashcardContext";
export default function PracticeScreenStart() {
  const colors = useThemeColors();
  const {
    stats,
    getNextCard,
    initializeDatabase,
    newCards,
    learningCards,
    laterCards,
    overdueCards,
    dueCards,
  } = useFlashcards();
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [orientation, setOrientation] = useState('Portrait'); // Added state for orientation

  const handleRefresh = async () => {
    try {
      await initializeDatabase();
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleRefresh();
    });
    return unsubscribe;
  }, [navigation]);

  const startReview = () => {
    getNextCard();
    navigation.navigate("Word");
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleWordPress = (word) => {
    // Optional: Handle word press event
    // For example, navigate to a word detail screen
    navigation.navigate("WordDetail", { wordId: word.id });
  };

  useEffect(() => {
    const handleOrientationChange = ({ window: { width, height } }) => {
      const newOrientation = width > height ? 'Landscape' : 'Portrait';
      setOrientation(newOrientation); // Update orientation state
      console.log(`iPad Orientation: ${newOrientation}`);
    };

    // Add event listener for orientation changes
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);

    // Initial log and state setting
    const { width, height } = Dimensions.get('window');
    handleOrientationChange({ window: { width, height } });

    // Cleanup the event listener on unmount
    return () => {
      if (typeof subscription?.remove === 'function') {
        subscription.remove();
      } else {
        // For React Native versions < 0.65
        Dimensions.removeEventListener('change', handleOrientationChange);
      }
    };
  }, []);

  return (
    <View style={[styles.superContainer, { backgroundColor: colors.homeScreenBackground }]}>
      <StatusBar hidden={true} />
      <Animated.View style={[styles.screenHeaderContainer, { opacity: headerOpacity }]}>
        <ScreenHeader text="Practice" />
      </Animated.View>
      <Screen>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.allBoxContainer}>
            {/* New Cards */}
            <WordBox
              words={newCards.map((card) => ({
                id: card.id,
                word: card.front,
              }))}
              color={colors.newWords}
              title="New"
              containerStyle={styles.wordBoxContainer}
              titleStyle={styles.sectionTitle}
              onWordPress={handleWordPress} // Optional
            />

            {/* Learning Cards */}
            <WordBox
              words={learningCards.map((card) => ({
                id: card.id,
                word: card.front,
              }))}
              color={colors.learnWords}
              title="Learn"
              containerStyle={styles.wordBoxContainer}
              titleStyle={styles.sectionTitle}
              onWordPress={handleWordPress} // Optional
            />

            {/* Due Cards */}
            <WordBox
              words={dueCards.concat(overdueCards).map((card) => ({
                id: card.id,
                word: card.front,
              }))}
              color={colors.dueWords}
              title="Due"
              containerStyle={styles.wordBoxContainer}
              titleStyle={styles.sectionTitle}
              onWordPress={handleWordPress} // Optional
            />
          </View>
        </Animated.ScrollView>

        {/* Start Button */}
        {newCards.length === 0 &&
        learningCards.length === 0 &&
        dueCards.length === 0 &&
        overdueCards.length === 0 ? (
          <View
            style={[
              styles.startBoxContainer,
              orientation === 'Landscape' && { bottom: 70}, // Lift up by 20 in Landscape
            ]}
          >
            <PracticeStartButton text="Start" deactivated={true} />
          </View>
        ) : (
          <View
            style={[
              styles.startBoxContainer,
              orientation === 'Landscape' && { bottom: 70 }, // Lift up by 20 in Landscape
            ]}
          >
            <PracticeStartButton text="Start" deactivated={false} onPress={startReview} />
          </View>
        )}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
  },
  screenHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  contentContainer: {
    padding: layout.margins.homeScreenWidgets / 2,
    paddingTop: layout.margins.practiceScreenStart.betweenHeaderAndWidgets
  },
  allBoxContainer: {
    borderRadius: 20,
    shadowColor: layout.shadows.homeScreenWidgets.shadowColor,
    shadowOffset: layout.shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: layout.shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: layout.shadows.homeScreenWidgets.shadowRadius,
    elevation: layout.shadows.homeScreenWidgets.elevation,
    padding: 10,
  },
  wordBoxContainer: {
  },
  startBoxContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
  },
  sectionTitle: {
    fontSize: layout.fontSize.dictionary.sectionTitle,
    fontWeight: "bold",
    marginBottom: 10,
    // color is handled via props
  },
});
