import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import colors from "../config/colors";
import PracticeStatsFooter from "../components/PracticeStatsFooter";
import PracticeRatingTab from "../components/PracticeRatingTab";
import PracticeDividerLine from "../components/PracticeDividerLine";
import PracticeAudio from "../components/PracticeAudio";
import { useFlashcards } from "../context/FlashcardContext";

const { width, height } = Dimensions.get("window");

export default function PracticeScreenDef({ navigation }) {
  useEffect(() => {
    async function setupAudio() {
      try {
        console.log("Setting up audio...");
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: false,
          playThroughEarpieceAndroid: false
        });
        console.log("Audio setup complete");
      } catch (error) {
        console.error("Error setting up audio:", error);
      }
    }
    
    setupAudio();
  }, []);

  const { currentCard, submitReview, getNextCard, stats } = useFlashcards();

  const handleReview = (rating) => {
    submitReview(rating);
    const nextCard = getNextCard();
    if (nextCard) {
      navigation.navigate("Word");
    } else {
      navigation.navigate("PracticeStart");
    }
  };

  const handleAudioWordPress = async () => {
    if (currentCard && currentCard.back) {
      try {
        const backData = JSON.parse(currentCard.back[0]);
        const audioFileName = backData.audioWordID + '.mp3';
        const audioPath = `${FileSystem.documentDirectory}audio/${audioFileName}`;
        console.log("Audio path:", audioPath);

        // Check if file exists
        const fileInfo = await FileSystem.getInfoAsync(audioPath);
        if (!fileInfo.exists) {
          console.error("Audio file does not exist:", audioPath);
          return;
        }
        console.log("Audio file size:", fileInfo.size, "bytes");

        console.log("Creating sound object...");
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioPath },
          { shouldPlay: false }
        );
        console.log("Sound object created");

        console.log("Playing audio...");
        const playbackStatus = await sound.playAsync();
        console.log("Playback status:", playbackStatus);

        // Wait for the audio to finish
        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            console.log("Audio finished playing");
            await sound.unloadAsync();
          }
        });
      } catch (error) {
        console.error("Error in audio playback:", error);
      }
    }
  };

  const handleAudioContextPress = async () => {
    if (currentCard && currentCard.back) {
      try {
        const backData = JSON.parse(currentCard.back[0]);
        const audioFileName = backData.audioContextID + '.mp3';
        const audioPath = `${FileSystem.documentDirectory}audio/${audioFileName}`;
        console.log("Audio path:", audioPath);

        // Check if file exists
        const fileInfo = await FileSystem.getInfoAsync(audioPath);
        if (!fileInfo.exists) {
          console.error("Audio file does not exist:", audioPath);
          return;
        }
        console.log("Audio file size:", fileInfo.size, "bytes");

        console.log("Creating sound object...");
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioPath },
          { shouldPlay: false }
        );
        console.log("Sound object created");

        console.log("Playing audio...");
        const playbackStatus = await sound.playAsync();
        console.log("Playback status:", playbackStatus);

        // Wait for the audio to finish
        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            console.log("Audio finished playing");
            await sound.unloadAsync();
          }
        });
      } catch (error) {
        console.error("Error in audio playback:", error);
      }
    }
  };

  const renderCardContent = () => {
    if (!currentCard) return <Text>No card available</Text>;

    let backData;
    try {
      backData = JSON.parse(currentCard.back[0]);
      console.log(currentCard.back[0]);
    } catch (error) {
      console.error("Error parsing card data:", error);
      return <Text>Error: Could not parse card data</Text>;
    }

    if (!backData || typeof backData !== "object") {
      console.error("Invalid card data format");
      return <Text>Error: Invalid card data format</Text>;
    }

    return (
      <>
        <View style={styles.wordContainer}>
          <Text style={styles.word}>{backData.word || "N/A"}</Text>
        </View>
        <View style={styles.defContainer}>
          <Text style={styles.def}>{backData.wordDef || "N/A"}</Text>
        </View>
        <View style={styles.dividerLine}>
          <PracticeDividerLine
            width="100%"
            height={2}
            color={colors.utilityGreyUltraLight}
          />
        </View>
        <View style={styles.contextContainer}>
          <Text style={styles.context}>{backData.context || "N/A"}</Text>
        </View>
        <View style={styles.defContainer}>
          <Text style={styles.contextDef}>{backData.contextDef || "N/A"}</Text>
        </View>
      </>
    );
  };

  const grey = false; // You can change this to true to test the grey area

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <View style={styles.superContainer}>
        {grey ? (
          <View style={styles.greyArea} />
        ) : (
          <Image
            source={require("../../assets/empty.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.container}>
          {renderCardContent()}
          <View style={styles.audio}>
            <TouchableOpacity onPress={handleAudioWordPress} activeOpacity={.8}>
              <PracticeAudio />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAudioContextPress} activeOpacity={.8}>
              <PracticeAudio />
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <PracticeStatsFooter
              newCount={stats.new}
              learnCount={stats.learning}
              dueCount={stats.due}
            />
          </View>
          <View style={styles.allTabsContainer}>
            <View style={styles.tabContainer}>
              <PracticeRatingTab
                rating="Again"
                onPress={() => handleReview("again")}
              />
            </View>
            <View style={styles.tabContainer}>
              <PracticeRatingTab
                rating="Hard"
                onPress={() => handleReview("hard")}
              />
            </View>
            <View style={styles.tabContainer}>
              <PracticeRatingTab
                rating="Good"
                onPress={() => handleReview("good")}
              />
            </View>
            <View style={styles.tabContainer}>
              <PracticeRatingTab
                rating="Easy"
                onPress={() => handleReview("easy")}
              />
            </View>
          </View>
        </View>
      </View>
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
  greyArea: {
    position: "absolute",
    left: (width - 900) / 2,
    width: 900,
    height: 450,
    backgroundColor: colors.utilityGreyUltraLight,
    opacity: 0.5,
  },
  image: {
    position: "absolute",
    left: (width - 900) / 2,
    width: 900,
    height: 450,
  },
  container: {
    marginHorizontal: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  defContainer: {
    width: width * 0.8,
  },
  def: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "500",
    color: colors.utilityGrey,
    opacity: 0.85,
  },
  contextDef: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "500",
    color: colors.utilityGrey,
    opacity: 0.85,
  },
  word: {
    marginTop: 200,
    fontSize: 50,
    fontWeight: "600",
    color: colors.utilityGrey,
  },
  context: {
    fontSize: 25,
    fontWeight: "500",
    color: colors.utilityGrey,
  },
  contextContainer: {
    width: width * 0.8,
  },
  audio: {
    position: "absolute",
    bottom: 160,
  },
  footer: {
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
  },
  allTabsContainer: {
    position: "absolute",
    bottom: height * 0.25 - 210,
    right: -40,
  },
  tabContainer: {
    marginBottom: 0,
  },
  dividerLine: {
    marginVertical: 50,
    width: "100%",
    width: width * 0.8,
  },
});
